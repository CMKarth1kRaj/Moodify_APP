import { Song } from '../types';

const API_URL = 'https://www.googleapis.com/youtube/v3';

// This is a simplified and estimated mapping. 
// A real implementation would require a more detailed study of the YouTube API response.
const mapYoutubeTrackToSong = (item: any): Song => ({
    id: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    album: '', // YouTube API doesn't directly provide album info in search results
    duration: 0, // Duration needs to be fetched from a separate endpoint
    previewUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    coverArt: item.snippet.thumbnails.high.url,
});

export const searchSongs = async (query: string): Promise<Song[]> => {
    if (!query) return [];
    try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const response = await fetch(`${API_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`, {
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("YouTube API Error:", errorBody);
            throw new Error(`YouTube API responded with status: ${response.status} - ${errorBody?.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();

        if (data.items && Array.isArray(data.items)) {
            return data.items.map(mapYoutubeTrackToSong);
        }
        return [];
    } catch (error) {
        console.error('Error searching for songs on YouTube:', error);
        throw error;
    }
};
