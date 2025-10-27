import React from 'react';
import type { Playlist } from '../types';
import { useApp } from '../context/AppContext';
import { PlayIcon } from './icons/PlayIcon';
import PlaylistCoverArt from './PlaylistCoverArt';

interface PlaylistHeaderProps {
    playlist: Playlist;
}

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ playlist }) => {
    const { playSong } = useApp();

    const handlePlayPlaylist = () => {
        if (playlist.songs.length > 0) {
            playSong(playlist.songs[0], playlist);
        }
    };

    const totalDurationMinutes = Math.floor(playlist.songs.reduce((acc, song) => acc + song.duration, 0) / 60);

    return (
        <header className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="flex-shrink-0">
                <PlaylistCoverArt playlist={playlist} className="w-48 h-48 lg:w-56 lg:h-56 shadow-2xl rounded-lg" />
            </div>
            <div className="flex flex-col gap-2 text-center md:text-left">
                <span className="text-sm font-bold">Playlist</span>
                <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tighter">{playlist.name}</h1>
                {playlist.description && <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">{playlist.description}</p>}
                <p className="text-sm mt-2">
                    <span>{playlist.songs.length} songs, </span>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        about {totalDurationMinutes} min
                    </span>
                </p>
                <button
                    onClick={handlePlayPlaylist}
                    className="mt-4 p-4 bg-primary text-white rounded-full w-16 h-16 self-center md:self-start hover:scale-105 transition-transform"
                    disabled={playlist.songs.length === 0}
                >
                    <PlayIcon className="h-full w-full" />
                </button>
            </div>
        </header>
    );
};

export default PlaylistHeader;
