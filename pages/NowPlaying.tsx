
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { NextIcon } from '../components/icons/NextIcon';
import { PrevIcon } from '../components/icons/PrevIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { ShuffleIcon } from '../components/icons/ShuffleIcon';
import { LoopIcon } from '../components/icons/LoopIcon';
import { ShareIcon } from '../components/icons/ShareIcon';
import { QueueIcon } from '../components/icons/QueueIcon';

const NowPlaying: React.FC = () => {
    const {
        currentSong, isPlaying, togglePlayPause, playNext, playPrev,
        progress, duration, seek, isLooping, setIsLooping, isShuffling,
        setIsShuffling, toggleSongLike, userPlaylists, setIsPlayerExpanded, currentPlaylist,
    } = useApp();

    const [view, setView] = useState<'cover' | 'lyrics' | 'queue'>('cover');

    const likedSongsPlaylist = userPlaylists.find(p => p.id === 'liked-songs');
    const isLiked = currentSong ? likedSongsPlaylist?.songs.some(s => s.id === currentSong.id) : false;

    const queue = useMemo(() => {
        if (!currentPlaylist || !currentSong) return [];
        const songList = currentPlaylist.songs;
        const currentIndex = songList.findIndex(s => s.id === currentSong.id);
        if (currentIndex === -1) return songList;
        return [...songList.slice(currentIndex + 1), ...songList.slice(0, currentIndex + 1)];
    }, [currentPlaylist, currentSong]);


    if (!currentSong) return null;
    
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const headerTitle = {
        cover: "Now Playing",
        lyrics: "Lyrics",
        queue: "Up Next"
    }[view];

    return (
        <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg z-[60] flex flex-col p-4 lg:p-8">
            <header className="flex items-center justify-between">
                <button onClick={() => setIsPlayerExpanded(false)} className="p-2">
                    <ChevronDownIcon className="h-8 w-8" />
                </button>
                <h2 className="font-bold text-lg">{headerTitle}</h2>
                <button onClick={() => alert('Share functionality coming soon!')} className="p-2">
                    <ShareIcon className="h-7 w-7" />
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 overflow-hidden my-4">
                {view === 'cover' && (
                     <>
                         <img src={currentSong.coverArt} alt={currentSong.title} className="w-full max-w-sm aspect-square rounded-lg shadow-2xl mb-8 object-cover" />
                         <div className="w-full max-w-sm">
                             <h1 className="text-3xl font-bold truncate">{currentSong.title}</h1>
                             <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary truncate">{currentSong.artist}</p>
                         </div>
                    </>
                )}
                {view === 'lyrics' && (
                    <div className="w-full h-full flex flex-col pt-4 text-left overflow-y-auto">
                        <p className="whitespace-pre-wrap text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            {currentSong.lyrics || "No lyrics available for this song."}
                        </p>
                    </div>
                )}
                {view === 'queue' && (
                    <div className="w-full h-full flex flex-col pt-4">
                        <div className="overflow-y-auto flex-1">
                            {queue.map(song => {
                                const isCurrent = song.id === currentSong.id;
                                return (
                                <div key={song.id} className={`flex items-center gap-4 p-2 text-left rounded-md ${isCurrent ? 'bg-primary/20' : 'hover:bg-light-surface dark:hover:bg-dark-surface'}`}>
                                    <img src={song.coverArt} alt={song.title} className="h-12 w-12 rounded-md object-cover flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className={`font-semibold truncate ${isCurrent ? 'text-primary' : ''}`}>{song.title}</p>
                                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{song.artist}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                )}
            </main>
            
            <footer className="w-full max-w-lg mx-auto pb-8">
                <div className="flex justify-center gap-4 mb-4">
                    <button onClick={() => setView('cover')} className={`font-bold ${view === 'cover' ? 'text-primary' : ''}`}>Song</button>
                    <button onClick={() => setView('lyrics')} className={`font-bold ${view === 'lyrics' ? 'text-primary' : ''}`}>Lyrics</button>
                    <button onClick={() => setView('queue')} className={`font-bold ${view === 'queue' ? 'text-primary' : ''}`}>Queue</button>
                </div>
                <div className="w-full flex items-center gap-2">
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary w-10 text-right">{formatTime(progress)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
                    />
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary w-10">{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                     <button onClick={() => toggleSongLike(currentSong)} className={`p-1 ${isLiked ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <HeartIcon className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => setIsShuffling(!isShuffling)} className={`p-1 ${isShuffling ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <ShuffleIcon className="h-6 w-6" />
                    </button>
                    <button onClick={playPrev} className="p-1 text-light-text dark:text-dark-text">
                        <PrevIcon className="h-10 w-10" />
                    </button>
                    <button onClick={togglePlayPause} className="p-4 bg-primary text-white rounded-full mx-2">
                        {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
                    </button>
                    <button onClick={playNext} className="p-1 text-light-text dark:text-dark-text">
                        <NextIcon className="h-10 w-10" />
                    </button>
                    <button onClick={() => setIsLooping(!isLooping)} className={`p-1 ${isLooping ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <LoopIcon className="h-6 w-6" />
                    </button>
                     <button onClick={() => setView('queue')} className={`p-1 ${view === 'queue' ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <QueueIcon className="h-6 w-6" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default NowPlaying;
