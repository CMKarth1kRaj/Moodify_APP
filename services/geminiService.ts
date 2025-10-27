import { GoogleGenAI } from "@google/genai";
import type { Mood } from '../types';

const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_API_KEY!});

const generatePlaylistPrompt = (mood: Mood): string => {
    return `You are a creative music curator with deep knowledge of popular music.
I am feeling ${mood}.
Your task is to:
1.  Create a creative and catchy name for a playlist that fits this mood.
2.  Write a short, engaging description for this playlist.
3.  Provide a list of 10 search queries for popular songs. Each query MUST be in the format "Artist Name - Song Title". These songs must be very popular and easy to find on services like Spotify or Deezer. For example: "Tame Impala - The Less I Know The Better", "Frank Ocean - Chanel", "Daft Punk - Get Lucky". Do not use genres or general descriptions as song suggestions.

Return ONLY a single, raw JSON object (no markdown formatting) with the keys "playlistName", "description", and "songSuggestions". The "songSuggestions" value must be an array of strings.
Example:
{"playlistName": "Sunset Drive", "description": "Cruising with the windows down as the sky turns orange.", "songSuggestions": ["The Weeknd - Blinding Lights", "Daft Punk - Get Lucky", "Glass Animals - Heat Waves", "Lana Del Rey - Summertime Sadness"]}`.trim();
};

interface GeminiPlaylistResponse {
    playlistName: string;
    description: string;
    songSuggestions: string[];
}

export const generateMoodPlaylist = async (mood: Mood): Promise<{ playlistName: string; description: string; songSuggestions: { title: string; artist: string; }[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-pro",
            contents: generatePlaylistPrompt(mood),
        });

        let jsonText = response.text.trim();

        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        const parsed: GeminiPlaylistResponse = JSON.parse(jsonText);

        if (parsed && Array.isArray(parsed.songSuggestions)) {
            const suggestions = parsed.songSuggestions.map(term => {
                const [artist, title] = term.split(' - ');
                return { title, artist };
            });
            return {
                playlistName: parsed.playlistName,
                description: parsed.description,
                songSuggestions: suggestions
            };
        } else {
            console.error("Gemini API returned unexpected JSON structure:", parsed);
            throw new Error("Failed to parse playlist from Gemini response.");
        }

    } catch (error) {
        console.error('Error generating playlist with Gemini:', error);
        throw new Error('Could not generate playlist. Please check your API key and network connection.');
    }
};
