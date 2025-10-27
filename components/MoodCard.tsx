import React from 'react';
import type { Mood } from '../types';

const moodColors: Record<Mood, string> = {
    Happy: 'from-yellow-400 to-orange-500',
    Calm: 'from-blue-400 to-cyan-500',
    Sad: 'from-indigo-400 to-purple-500',
    Energetic: 'from-red-500 to-pink-500',
    Focused: 'from-green-500 to-teal-500',
};

interface MoodCardProps {
    mood: Mood;
    onClick: () => void;
    disabled?: boolean;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative p-4 rounded-lg h-28 w-full overflow-hidden cursor-pointer bg-gradient-to-br ${moodColors[mood]} transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <h3 className="text-white font-bold text-xl text-left">{mood}</h3>
             <img
                src={`https://source.unsplash.com/100x100/?${mood},music`}
                alt={mood}
                className="absolute bottom-[-10px] right-[-10px] transform rotate-25 h-20 w-20 opacity-60"
             />
        </button>
    );
};

export default MoodCard;