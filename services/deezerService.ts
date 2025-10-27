import { Song } from '../types';

// Using a public CORS proxy for demonstration purposes.
// In a production environment, you should host your own or use a server-side API call.
const PROXY_URL = 'https://cors.eu.org/';
const API_URL = 'https://api.deezer.com';

interface DeezerTrack {
    id: number;
    title: string;
    preview: string;
    duration: number;
    artist: {
        name: string;
    };
    album: {
        title: string;
        cover_medium: string;
    };
}

const mapDeezerTrackToSong = (track: DeezerTrack): Song => ({
    id: track.id,
    title: track.title,
    artist: track.artist.name,
    album: track.album.title,
    duration: track.duration,
    previewUrl: track.preview,
    coverArt: track.album.cover_medium,
});


export const searchSongs = async (query: string): Promise<Song[]> => {
    if (!query) return [];
    try {
        const response = await fetch(`${PROXY_URL}${API_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Deezer API responded with status: ${response.status}`);
        }
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
           return data.data.map(mapDeezerTrackToSong).filter((s: Song) => s.previewUrl);
        }
        return [];
    } catch (error) {
        console.error('Error searching for songs on Deezer:', error);
        return [];
    }
};