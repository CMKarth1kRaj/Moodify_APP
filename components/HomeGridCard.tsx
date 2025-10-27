import React from 'react';
import type { Playlist } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import PlaylistCoverArt from './PlaylistCoverArt';

interface HomeGridCardProps {
    item: Playlist;
    onClick: () => void;
}

const HomeGridCard: React.FC<HomeGridCardProps> = ({ item, onClick }) => {
    
    return (
        <button 
            onClick={onClick}
            className="group relative p-4 rounded-lg bg-light-surface dark:bg-dark-surface hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors w-full flex flex-col text-left"
        >
            <div className="relative">
                <PlaylistCoverArt playlist={item} className="w-full h-auto rounded-lg shadow-lg aspect-square" />
                <div className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                    <PlayIcon className="h-6 w-6" />
                </div>
            </div>
            <p className="font-bold truncate mt-2">{item.name}</p>
            {item.description && <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{item.description}</p>}
        </button>
    );
};

export default HomeGridCard;