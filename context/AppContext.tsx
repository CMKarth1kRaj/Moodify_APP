import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { AppContextType, Song, Playlist, Mood, Page, ThemePreference, JamSession, AuthState, User, AdminPage } from '../types';
import { generateMoodPlaylist } from '../services/geminiService';
import { searchSongs } from '../services/youtubeMusicService';

const likedSongsPlaylist: Playlist = {
    id: 'liked-songs',
    name: 'Liked Songs',
    songs: [],
    coverArt: 'https://e-cdns-images.dzcdn.net/images/cover/a77b7549041648a80355146b9a84358a/264x264-000000-80-0-0.jpg',
    description: 'Your favorite tracks'
};

const initialPlaylists: Playlist[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>('loading');
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>(initialPlaylists);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [themePreference, setThemePreferenceState] = useState<ThemePreference>('dark');
    const [searchTerm, setSearchTerm] = useState('');
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
    const [jamSessions, setJamSessions] = useState<JamSession[]>([]);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [songs, setSongs] = useState<Song[]>([]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const originalPlaylistOrder = useRef<Song[]>([]);

    useEffect(() => {
        // Simulate checking auth status
        setTimeout(() => {
            const storedUser = localStorage.getItem('moodifyUser');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setAuthState('authenticated');
            } else {
                setAuthState('onboarding');
            }
        }, 1500); // Splash screen duration

        const storedTheme = localStorage.getItem('themePreference') as ThemePreference;
        if (storedTheme) setThemePreferenceState(storedTheme);
        
        const storedPlaylists = localStorage.getItem('userPlaylists');
        if (storedPlaylists) setUserPlaylists(JSON.parse(storedPlaylists));
        else setUserPlaylists([likedSongsPlaylist]);

        const storedLikedSongs = localStorage.getItem('likedSongs');
         if (storedLikedSongs) {
             const liked = JSON.parse(storedLikedSongs);
             setUserPlaylists(prev => {
                const hasLikedPlaylist = prev.some(p => p.id === 'liked-songs');
                if (hasLikedPlaylist) {
                    return prev.map(p => p.id === 'liked-songs' ? { ...p, songs: liked } : p);
                }
                return [{ ...likedSongsPlaylist, songs: liked }, ...prev];
            });
         }
    }, []);

    useEffect(() => {
        if (authState !== 'authenticated') return;
        const likedSongs = userPlaylists.find(p => p.id === 'liked-songs')?.songs || [];
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
        const customPlaylists = userPlaylists.filter(p => p.id !== 'liked-songs');
        if (customPlaylists.length > 0) {
            localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
        }
    }, [userPlaylists, authState]);


    // --- AUTH ---
    const completeOnboarding = () => setAuthState('unauthenticated');

    const login = (email: string, pass: string) => {
        setIsLoading(true);
        // Admin login
        if (email.toLowerCase() === 'admin@moodify.app' && pass === 'admin123') {
             const adminUser: User = { id: 'admin-user', username: 'Admin', email, avatar: 'https://i.pravatar.cc/150?u=admin', isAdmin: true };
             setUser(adminUser);
             localStorage.setItem('moodifyUser', JSON.stringify(adminUser));
             setAuthState('authenticated');
        } else { // Regular user login
            const mockUser: User = { id: 'user-123', username: 'Guest', email, avatar: 'https://i.pravatar.cc/150?u=guest' };
            setUser(mockUser);
            localStorage.setItem('moodifyUser', JSON.stringify(mockUser));
            setAuthState('authenticated');
        }
        setIsLoading(false);
    };

    const register = (email: string, pass: string) => {
        // Mock registration, move to profile setup
        setAuthState('profile_setup');
    };

    const completeProfileSetup = (username: string, avatar: string, bio?: string) => {
        const newUser: User = { id: `user-${Date.now()}`, username, email: 'newuser@moodify.app', avatar, bio };
        setUser(newUser);
        localStorage.setItem('moodifyUser', JSON.stringify(newUser));
        setAuthState('authenticated');
    };

    const logout = () => {
        localStorage.removeItem('moodifyUser');
        setUser(null);
        setAuthState('unauthenticated');
    };


    // --- PLAYER ---
    const setThemePreference = (theme: ThemePreference) => {
        setThemePreferenceState(theme);
        localStorage.setItem('themePreference', theme);
    };

    const playSong = React.useCallback((song: Song, playlist?: Playlist) => {
        setCurrentSong(song);
        if (playlist && playlist.id !== currentPlaylist?.id) {
            setCurrentPlaylist(playlist);
            originalPlaylistOrder.current = playlist.songs;
        }
        if (audioRef.current && song.previewUrl) {
            audioRef.current.src = song.previewUrl;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.error("Audio play failed:", e));
            }
        } else if (!song.previewUrl) {
            console.warn("Song has no preview URL:", song.title);
            setIsPlaying(false);
        }
    }, [currentPlaylist?.id]);
    
    const playNext = React.useCallback(() => {
        if (!currentPlaylist || !currentSong) return;
        const songs = isShuffling ? currentPlaylist.songs : originalPlaylistOrder.current;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % songs.length;
        playSong(songs[nextIndex], currentPlaylist);
    }, [currentPlaylist, currentSong, isShuffling, playSong]);
    
    const playPrev = React.useCallback(() => {
        if (!currentPlaylist || !currentSong) return;
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }
        const songs = isShuffling ? currentPlaylist.songs : originalPlaylistOrder.current;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playSong(songs[prevIndex], currentPlaylist);
    }, [currentPlaylist, currentSong, isShuffling, playSong]);
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => playNext();
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [playNext]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio || !audio.src) return;
        if (isPlaying) audio.pause();
        else audio.play().catch(e => console.error("Error playing audio:", e));
        setIsPlaying(!isPlaying);
    };

    const seek = (time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
        setProgress(time);
    };
    
    const setAudioVolume = (vol: number) => {
        if (audioRef.current) audioRef.current.volume = vol;
        setVolume(vol);
    };
    
    const toggleLooping = (loop: boolean) => {
        setIsLooping(loop);
        if (audioRef.current) audioRef.current.loop = loop;
    };
    
    const toggleShuffling = (shuffle: boolean) => {
        setIsShuffling(shuffle);
        if (!currentPlaylist) return;
        if (shuffle) {
            const shuffled = [...originalPlaylistOrder.current].sort(() => Math.random() - 0.5);
            setCurrentPlaylist({ ...currentPlaylist, songs: shuffled });
        } else {
            setCurrentPlaylist({ ...currentPlaylist, songs: originalPlaylistOrder.current });
        }
    };

    // --- PLAYLISTS & SESSIONS ---
    const getMoodPlaylist = async (mood: Mood) => {
        setIsLoading(true);
        setError(null);
        try {
            const { playlistName, description, songSuggestions } = await generateMoodPlaylist(mood);
            const songPromises = songSuggestions.map(suggestion => searchSongs(suggestion.title).then(results => results[0]));
            let songs = (await Promise.all(songPromises)).filter(Boolean) as Song[];
            const uniqueSongsMap = new Map<string, Song>();
            songs.forEach(song => uniqueSongsMap.set(song.id, song));
            songs = Array.from(uniqueSongsMap.values());

            const newPlaylist: Playlist = {
                id: `mood-${Date.now()}`,
                name: playlistName,
                description,
                songs,
                coverArt: songs.length > 0 ? songs[0].coverArt : `https://source.unsplash.com/400x400/?${mood},music`,
            };
            setUserPlaylists(prev => [newPlaylist, ...prev]);
            setCurrentPlaylist(newPlaylist);
            setCurrentPage('playlist');
            if (songs.length > 0) playSong(songs[0], newPlaylist);
        } catch (e: any) {
            setError(e.message || "Failed to create mood playlist.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSongLike = (song: Song) => {
        setUserPlaylists(prev => {
            const likedPlaylist = prev.find(p => p.id === 'liked-songs') ?? { ...likedSongsPlaylist };
            const isLiked = likedPlaylist.songs.some(s => s.id === song.id);
            const newSongs = isLiked ? likedPlaylist.songs.filter(s => s.id !== song.id) : [song, ...likedPlaylist.songs];
            const updatedLikedPlaylist = { ...likedPlaylist, songs: newSongs };
            const otherPlaylists = prev.filter(p => p.id !== 'liked-songs');
            return [updatedLikedPlaylist, ...otherPlaylists];
        });
    };

    const createPlaylist = (name: string, description: string) => {
        const newPlaylist: Playlist = {
            id: `custom-${Date.now()}`,
            name,
            description,
            songs: [],
            coverArt: `https://source.unsplash.com/400x400/?${name.replace(/\s/g, '')},music`,
        };
        setUserPlaylists(prev => [newPlaylist, ...prev]);
        setCurrentPlaylist(newPlaylist);
        setCurrentPage('playlist');
    };

    const addSongToPlaylist = (songId: string, playlistId: number | string) => {
        let songToAdd: Song | undefined;
        for (const playlist of [...userPlaylists, currentPlaylist].filter(Boolean) as Playlist[]) {
            songToAdd = playlist.songs.find(s => s.id === songId);
            if (songToAdd) break;
        }
        if (!songToAdd) return;

        setUserPlaylists(prev => prev.map(p => {
            if (p.id === playlistId && !p.songs.some(s => s.id === songId)) {
                return { ...p, songs: [...p.songs, songToAdd!] };
            }
            return p;
        }));
    };
    
    const createJamSession = async (name: string, limit: number, isPublic: boolean, mood: Mood) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const { playlistName, description, songSuggestions } = await generateMoodPlaylist(mood);
            const songPromises = songSuggestions.map(suggestion => searchSongs(suggestion.title).then(results => results[0]));
            const songs = (await Promise.all(songPromises)).filter(Boolean) as Song[];

            const jamPlaylist: Playlist = {
                id: `jam-${Date.now()}`,
                name: playlistName,
                description,
                songs,
                coverArt: songs.length > 0 ? songs[0].coverArt : `https://source.unsplash.com/400x400/?${mood},music`
            };
            const newJamSession: JamSession = {
                id: `jam-session-${Date.now()}`,
                name,
                participantLimit: limit,
                participants: [user],
                isPublic,
                mood,
                playlist: jamPlaylist,
                createdBy: user
            };

            setJamSessions(prev => [newJamSession, ...prev]);
            setCurrentPlaylist(jamPlaylist);
            // This is a temporary fix, Jam Sessions need their own page state
            // For now, we reuse the library page to show it
            setCurrentPage('library'); 
            if (songs.length > 0) playSong(songs[0], jamPlaylist);
        } catch (e: any) {
            setError(e.message || "Failed to create jam session.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const joinJamSession = (sessionId: string) => {
        const session = jamSessions.find(j => j.id === sessionId);
        if (session) {
            setCurrentPlaylist(session.playlist);
            // This is a temporary fix
            setCurrentPage('library'); 
             if (session.playlist.songs.length > 0) playSong(session.playlist.songs[0], session.playlist);
        }
    };

    // --- ADMIN ---
    const addSong = (song: Omit<Song, 'id'>) => {
        const newSong: Song = { ...song, id: Date.now().toString() };
        setSongs(prev => [newSong, ...prev]);
    };
    const updateSong = (updatedSong: Song) => {
        setSongs(prev => prev.map(s => s.id === updatedSong.id ? updatedSong : s));
    };
    const deleteSong = (songId: string) => {
        setSongs(prev => prev.filter(s => s.id !== songId));
    };

    const value: AppContextType = {
        authState, user, currentPage, userPlaylists, currentPlaylist, currentSong, isPlaying, isLoading, error, themePreference, searchTerm, isPlayerExpanded, jamSessions, isLooping, isShuffling, progress, duration, volume, songs, adminPage,
        setAuthState, completeOnboarding, login, logout, register, completeProfileSetup,
        setCurrentPage: (page) => {
            setCurrentPage(page);
        },
        setCurrentPlaylist, playSong, togglePlayPause, playNext, playPrev, getMoodPlaylist, toggleSongLike, createPlaylist, addSongToPlaylist, setThemePreference, setSearchTerm, setIsPlayerExpanded, createJamSession, joinJamSession, setIsLooping: toggleLooping, setIsShuffling: toggleShuffling, seek, setVolume: setAudioVolume,
        setAdminPage, addSong, updateSong, deleteSong,
        isAdmin: !!user?.isAdmin,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <audio ref={audioRef} />
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
