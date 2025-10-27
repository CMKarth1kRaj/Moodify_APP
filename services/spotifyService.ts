import { Song } from '../types';

const API_URL = 'https://api.spotify.com/v1';

// Function to get an access token from Spotify
const getAccessToken = async (): Promise<string> => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Spotify Auth Error:", errorBody);
        throw new Error(`Failed to get Spotify access token: ${errorBody.error_description || response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
};

interface SpotifyTrack {
    id: string;
    name: string;
    preview_url: string;
    duration_ms: number;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
}

const mapSpotifyTrackToSong = (track: SpotifyTrack): Song => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    duration: Math.round(track.duration_ms / 1000),
    previewUrl: track.preview_url,
    coverArt: track.album.images.length > 0 ? track.album.images[0].url : '',
});

export const searchSongs = async (query: string): Promise<Song[]> => {
    if (!query) return [];
    try {
        const accessToken = await getAccessToken();
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}&type=track`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Spotify Search Error:", errorBody);
            throw new Error(`Spotify API responded with status: ${response.status} - ${errorBody?.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();

        if (data.tracks && data.tracks.items && Array.isArray(data.tracks.items)) {
            return data.tracks.items.map(mapSpotifyTrackToSong).filter((s: Song) => s.previewUrl);
        }
        return [];
    } catch (error) {
        console.error('Error searching for songs on Spotify:', error);
        // Re-throw the error so the UI can catch it and display a message
        throw error;
    }
};
