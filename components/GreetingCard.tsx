import React from 'react';
import type { Playlist } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import PlaylistCoverArt from './PlaylistCoverArt';

interface GreetingCardProps {
    item: Playlist;
    onClick: () => void;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ item, onClick }) => {
    
    return (
        <button 
            onClick={onClick} 
            className="group flex items-center bg-light-surface dark:bg-dark-surface rounded-md overflow-hidden h-20 shadow-md hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors w-full"
        >
            <PlaylistCoverArt playlist={item} className="h-20 w-20 flex-shrink-0" />
            <div className="flex-1 px-4 text-left">
                <p className="font-bold truncate">{item.name}</p>
            </div>
            <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-3 bg-primary text-white rounded-full shadow-lg">
                    <PlayIcon className="h-5 w-5" />
                </div>
            </div>
        </button>
    );
};

export default GreetingCard;