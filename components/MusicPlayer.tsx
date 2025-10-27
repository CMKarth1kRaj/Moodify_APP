import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { NextIcon } from './icons/NextIcon';
import { PrevIcon } from './icons/PrevIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ShuffleIcon } from './icons/ShuffleIcon';
import { LoopIcon } from './icons/LoopIcon';
import { VolumeIcon } from './icons/VolumeIcon';
import { VolumeMuteIcon } from './icons/VolumeMuteIcon';
import MarqueeText from './MarqueeText';

const MusicPlayer: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        togglePlayPause,
        playNext,
        playPrev,
        progress,
        duration,
        seek,
        volume,
        setVolume,
        isLooping,
        setIsLooping,
        isShuffling,
        setIsShuffling,
        toggleSongLike,
        userPlaylists,
        setIsPlayerExpanded
    } = useApp();

    const [tempVolume, setTempVolume] = useState(volume);
    const likedSongsPlaylist = userPlaylists.find(p => p.id === 'liked-songs');
    const isLiked = currentSong ? likedSongsPlaylist?.songs.some(s => s.id === currentSong.id) : false;

    if (!currentSong) return null;

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-20 lg:bottom-0 left-0 right-0 h-24 bg-light-surface dark:bg-dark-elevated border-t border-light-elevated dark:border-dark-surface z-50 p-2 lg:p-4 text-light-text dark:text-dark-text">
            <div className="w-full h-full flex items-center justify-between gap-4">
                {/* Song Info */}
                <div className="flex items-center gap-3 w-1/4 min-w-0">
                    <img src={currentSong.coverArt} alt={currentSong.title} className="h-12 w-12 lg:h-16 lg:w-16 rounded-md object-cover cursor-pointer" onClick={() => setIsPlayerExpanded(true)} />
                    <div className="hidden sm:block min-w-0">
                        <MarqueeText className="font-bold">
                            {currentSong.title}
                        </MarqueeText>
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{currentSong.artist}</p>
                    </div>
                     <button onClick={() => toggleSongLike(currentSong)} className={`hidden lg:block ml-2 ${isLiked ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <HeartIcon className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center justify-center flex-1 w-1/2">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => setIsShuffling(!isShuffling)} className={`p-1 ${isShuffling ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                            <ShuffleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <button onClick={playPrev} className="p-1 text-light-text dark:text-dark-text">
                            <PrevIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        <button onClick={togglePlayPause} className="p-2 bg-primary text-white rounded-full">
                            {isPlaying ? <PauseIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
                        </button>
                        <button onClick={playNext} className="p-1 text-light-text dark:text-dark-text">
                            <NextIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        <button onClick={() => setIsLooping(!isLooping)} className={`p-1 ${isLooping ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                            <LoopIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                    <div className="w-full max-w-lg hidden lg:flex items-center gap-2 mt-2">
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={(e) => seek(Number(e.target.value))}
                            className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
                        />
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{formatTime(duration)}</span>
                    </div>
                </div>
                
                {/* Volume & Other Controls */}
                <div className="flex items-center justify-end gap-2 w-1/4">
                     <button onClick={() => toggleSongLike(currentSong)} className={`p-1 sm:p-2 lg:hidden ${isLiked ? 'text-primary' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                        <HeartIcon className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <div className="hidden md:flex items-center gap-2">
                        <button onClick={() => {
                            if (volume > 0) {
                                setTempVolume(volume);
                                setVolume(0);
                            } else {
                                setVolume(tempVolume);
                            }
                        }}>
                           {volume === 0 ? <VolumeMuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-24 h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm"
                        />
                    </div>
                     <button onClick={() => setIsPlayerExpanded(true)} className="p-1 sm:p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5"><path d="M15 3h6v6M9 21H3v-6M3 3l18 18"/></svg>
                    </button>
                </div>
            </div>
             {/* Mobile Progress Bar */}
            <div className="lg:hidden absolute bottom-0 left-2 right-2">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="w-full h-0.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundSize: `${(progress / duration) * 100}% 100%` }}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;