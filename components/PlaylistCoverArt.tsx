import React from 'react';
import type { Playlist } from '../types';
import { MusicIcon } from './icons/MusicIcon';
import { HeartIcon } from './icons/HeartIcon';

interface PlaylistCoverArtProps {
    playlist: Playlist;
    className?: string;
}

const PlaylistCoverArt: React.FC<PlaylistCoverArtProps> = ({ playlist, className = 'w-16 h-16' }) => {
    
    // Special case for Liked Songs
    if (playlist.id === 'liked-songs') {
        return (
            <div className={`${className} bg-gradient-to-br from-indigo-700 to-purple-500 flex items-center justify-center`}>
                <HeartIcon className="w-1/2 h-1/2 text-white" fill="white" />
            </div>
        );
    }
    
    // If a cover art URL is provided, use it.
    if (playlist.coverArt) {
        return <img src={playlist.coverArt} alt={playlist.name} className={`${className} object-cover`} />;
    }

    // If there are songs, create a mosaic of the first 4 cover arts.
    if (playlist.songs.length > 0) {
        const covers = playlist.songs.slice(0, 4).map(song => song.coverArt);
        // Pad with a placeholder if less than 4 songs
        while (covers.length < 4) {
            covers.push('');
        }
        
        return (
            <div className={`${className} grid grid-cols-2 grid-rows-2`}>
                {covers.map((cover, index) => (
                    <div key={index} className="w-full h-full bg-light-elevated dark:bg-dark-elevated">
                        {cover && <img src={cover} alt="" className="w-full h-full object-cover" />}
                    </div>
                ))}
            </div>
        );
    }
    
    // Fallback if no cover and no songs
    return (
        <div className={`${className} bg-light-elevated dark:bg-dark-elevated flex items-center justify-center`}>
            <MusicIcon className="w-1/2 h-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
        </div>
    );
};

export default PlaylistCoverArt;