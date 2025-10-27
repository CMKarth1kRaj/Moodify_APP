
import React from 'react';
import type { Mood } from '../types';
import { useApp } from '../context/AppContext';

const moods: Mood[] = ['Happy', 'Calm', 'Sad', 'Energetic', 'Focused'];
const moodColors: Record<Mood, string> = {
    Happy: 'bg-yellow-400 hover:bg-yellow-500',
    Calm: 'bg-blue-400 hover:bg-blue-500',
    Sad: 'bg-indigo-400 hover:bg-indigo-500',
    Energetic: 'bg-red-500 hover:bg-red-600',
    Focused: 'bg-green-500 hover:bg-green-600',
};

const MoodSelector: React.FC = () => {
    const { getMoodPlaylist, isLoading } = useApp();

    const handleMoodSelect = (mood: Mood) => {
        if (!isLoading) {
            getMoodPlaylist(mood);
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">How are you feeling?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {moods.map(mood => (
                    <button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        disabled={isLoading}
                        className={`p-6 rounded-lg text-white font-bold text-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${moodColors[mood]}`}
                    >
                        {mood}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
