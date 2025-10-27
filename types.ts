export interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: number; // in seconds
    previewUrl: string;
    coverArt: string;
    lyrics?: string;
    genre?: string;
}

export interface Playlist {
    id: number | string;
    name: string;
    description?: string;
    songs: Song[];
    coverArt: string;
    isPublic?: boolean;
}

export interface JamSession {
    id: string;
    name: string;
    participantLimit: number;
    participants: User[]; 
    isPublic: boolean;
    mood: Mood;
    playlist: Playlist;
    createdBy: User;
}

export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    bio?: string;
    favoriteGenres?: string[];
    isAdmin?: boolean;
}

export type AuthState = 'loading' | 'onboarding' | 'unauthenticated' | 'registering' | 'profile_setup' | 'authenticated';

export type Page = 
    | 'home' 
    | 'search' 
    | 'library' 
    | 'playlist' 
    | 'profile'
    | 'likedSongs';

export type AdminPage = 'dashboard' | 'songs' | 'labels' | 'reports' | 'notifications';

export type Mood = 'Happy' | 'Calm' | 'Sad' | 'Energetic' | 'Focused';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface AppContextType {
    // State
    authState: AuthState;
    user: User | null;
    currentPage: Page;
    userPlaylists: Playlist[];
    currentPlaylist: Playlist | null;
    currentSong: Song | null;
    isPlaying: boolean;
    isLoading: boolean;
    error: string | null;
    themePreference: ThemePreference;
    searchTerm: string;
    isPlayerExpanded: boolean;
    jamSessions: JamSession[];
    isLooping: boolean;
    isShuffling: boolean;
    progress: number;
    duration: number;
    volume: number;
    songs: Song[]; // For admin song management
    adminPage: AdminPage;

    // Setters & Functions
    setAuthState: (state: AuthState) => void;
    completeOnboarding: () => void;
    login: (email: string, pass: string) => void;
    logout: () => void;
    register: (email: string, pass: string) => void;
    completeProfileSetup: (username: string, avatar: string, bio?: string) => void;
    
    setCurrentPage: (page: Page) => void;
    setCurrentPlaylist: (playlist: Playlist) => void;
    playSong: (song: Song, playlist?: Playlist) => void;
    togglePlayPause: () => void;
    playNext: () => void;
    playPrev: () => void;
    getMoodPlaylist: (mood: Mood) => Promise<void>;
    toggleSongLike: (song: Song) => void;
    createPlaylist: (name: string, description: string) => void;
    addSongToPlaylist: (songId: number, playlistId: number | string) => void;
    setThemePreference: (theme: ThemePreference) => void;
    setSearchTerm: (term: string) => void;
    setIsPlayerExpanded: (isExpanded: boolean) => void;
    createJamSession: (name: string, limit: number, isPublic: boolean, mood: Mood) => Promise<void>;
    joinJamSession: (sessionId: string) => void;
    setIsLooping: (loop: boolean) => void;
    setIsShuffling: (shuffle: boolean) => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    
    // Admin functions
    setAdminPage: (page: AdminPage) => void;
    addSong: (song: Omit<Song, 'id'>) => void;
    updateSong: (song: Song) => void;
    deleteSong: (songId: number) => void;

    // Computed
    isAdmin: boolean;
}