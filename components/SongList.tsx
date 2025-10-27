
import React, { useState, useRef, useEffect } from 'react';
import type { Song, Playlist } from '../types';
import { useApp } from '../context/AppContext';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MoreHorizontalIcon } from './icons/MoreHorizontalIcon';

const SongList: React.FC<{ songs: Song[], playlist?: Playlist }> = ({ songs, playlist }) => {
    const { playSong, currentSong, isPlaying, togglePlayPause, toggleSongLike, userPlaylists, currentPlaylist, addSongToPlaylist } = useApp();
    const likedSongsPlaylist = userPlaylists.find(p => p.id === 'liked-songs');
    // Fix: Changed state to only accept number for song ID, or null.
    const [menuOpenForSong, setMenuOpenForSong] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Fix: The songId parameter is now correctly typed as a number.
    const handleMenuToggle = (e: React.MouseEvent, songId: number) => {
        e.stopPropagation();
        setMenuOpenForSong(prev => (prev === songId ? null : songId));
    };

    const handleAddSong = (e: React.MouseEvent, playlistId: string | number) => {
        e.stopPropagation();
        if (menuOpenForSong) {
            addSongToPlaylist(menuOpenForSong, playlistId);
        }
        setMenuOpenForSong(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenForSong(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const activePlaylist = playlist || currentPlaylist;
    const customPlaylists = userPlaylists.filter(p => p.id !== 'liked-songs');

    return (
        <div className="mt-8">
            <table className="w-full text-left">
                <thead className="text-light-text-secondary dark:text-dark-text-secondary border-b border-light-elevated dark:border-dark-elevated">
                    <tr>
                        <th className="p-3 text-center w-12">#</th>
                        <th className="p-3">Title</th>
                        <th className="p-3 hidden md:table-cell">Album</th>
                        <th className="p-3 w-36 text-center"></th>
                        <th className="p-3 w-20">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => {
                        const isCurrent = currentSong?.id === song.id;
                        const isLiked = likedSongsPlaylist?.songs.some(s => s.id === song.id);

                        return (
                            <tr
                                key={song.id}
                                className="group hover:bg-light-surface dark:hover:bg-dark-surface rounded-lg cursor-pointer"
                                onDoubleClick={() => playSong(song, activePlaylist)}
                            >
                                <td className="p-3 text-center text-light-text-secondary dark:text-dark-text-secondary">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {isCurrent && isPlaying ? (
                                            <button onClick={togglePlayPause} className="text-primary">
                                                <PauseIcon className="h-5 w-5" />
                                            </button>
                                        ) : (
                                            <>
                                                <span className="group-hover:hidden">{index + 1}</span>
                                                <button onClick={() => playSong(song, activePlaylist)} className="hidden group-hover:block">
                                                    <PlayIcon className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3 flex items-center gap-4">
                                    <img src={song.coverArt} alt={song.title} className="h-10 w-10 rounded-md object-cover" />
                                    <div>
                                        <p className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>{song.title}</p>
                                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{song.artist}</p>
                                    </div>
                                </td>
                                <td className="p-3 hidden md:table-cell text-light-text-secondary dark:text-dark-text-secondary truncate">{song.album}</td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-4 relative">
                                        {/* Fix: Pass the entire song object to toggleSongLike instead of just the id. */}
                                        <button onClick={() => toggleSongLike(song)} className={`transition-opacity ${isLiked ? 'text-primary opacity-100' : 'opacity-0 group-hover:opacity-100 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'}`}>
                                           <HeartIcon className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'}/>
                                        </button>
                                        <button onClick={(e) => handleMenuToggle(e, song.id)} className="opacity-0 group-hover:opacity-100 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text">
                                            <MoreHorizontalIcon className="w-5 h-5"/>
                                        </button>
                                        {menuOpenForSong === song.id && (
                                            <div ref={menuRef} className="absolute top-8 right-0 bg-light-elevated dark:bg-dark-elevated shadow-lg rounded-md z-10 w-48 py-1">
                                                <p className="px-3 py-1 text-xs font-bold">Add to playlist</p>
                                                {customPlaylists.length > 0 ? customPlaylists.map(p => (
                                                    <button key={p.id} onClick={(e) => handleAddSong(e, p.id)} className="block w-full text-left px-3 py-2 text-sm hover:bg-light-surface dark:hover:bg-dark-surface">
                                                        {p.name}
                                                    </button>
                                                )) : <p className="px-3 py-2 text-sm text-light-text-secondary">No playlists yet.</p>}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3 text-light-text-secondary dark:text-dark-text-secondary">{formatDuration(song.duration)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SongList;
