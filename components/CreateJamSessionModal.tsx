
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mood } from '../types';

interface CreateJamSessionModalProps {
    onClose: () => void;
}

const moods: Mood[] = ['Happy', 'Calm', 'Sad', 'Energetic', 'Focused'];
const moodColors: Record<Mood, string> = {
    Happy: 'border-yellow-400',
    Calm: 'border-blue-400',
    Sad: 'border-indigo-400',
    Energetic: 'border-red-500',
    Focused: 'border-green-500',
};
const selectedMoodColors: Record<Mood, string> = {
    Happy: 'bg-yellow-400 text-black',
    Calm: 'bg-blue-400 text-white',
    Sad: 'bg-indigo-400 text-white',
    Energetic: 'bg-red-500 text-white',
    Focused: 'bg-green-500 text-white',
};

const CreateJamSessionModal: React.FC<CreateJamSessionModalProps> = ({ onClose }) => {
    const { createJamSession, isLoading } = useApp();
    const [name, setName] = useState('');
    const [limit, setLimit] = useState(10);
    const [isPublic, setIsPublic] = useState(true);
    const [selectedMood, setSelectedMood] = useState<Mood>('Happy');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            await createJamSession(name.trim(), limit, isPublic, selectedMood);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-light-surface dark:bg-dark-elevated rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-center">Create a Jam Session</h2>
                {isLoading ? (
                    <div className="text-center py-10">
                         <p className="text-lg font-semibold">Creating your session...</p>
                         <p className="text-sm text-dark-text-secondary mt-1">AI is picking the perfect tracks!</p>
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-semibold block mb-1">Session Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="E.g., Weekend Vibes" className="w-full p-3 rounded bg-light-elevated dark:bg-dark-surface" required />
                    </div>
                    <div>
                         <label className="font-semibold block mb-1">Pick a mood</label>
                         <div className="flex flex-wrap gap-2">
                             {moods.map(mood => (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => setSelectedMood(mood)}
                                    className={`px-3 py-1 text-sm rounded-full font-semibold border-2 transition-colors ${selectedMood === mood ? `${selectedMoodColors[mood]} ${moodColors[mood]}` : `${moodColors[mood]} text-white/70 hover:bg-white/10`}`}>
                                 {mood}
                                </button>
                            ))}
                         </div>
                    </div>
                     <div>
                        <label htmlFor="limit" className="font-semibold block mb-1">Participant Limit: {limit}</label>
                        <input id="limit" type="range" min="2" max="50" value={limit} onChange={e => setLimit(Number(e.target.value))} className="w-full" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="isPublic" className="font-semibold">Public Session</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="isPublic" className="sr-only peer" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                            <div className="w-11 h-6 bg-light-elevated peer-focus:outline-none rounded-full peer dark:bg-dark-surface peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded font-semibold">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-full font-bold" disabled={!name.trim() || isLoading}>
                            {isLoading ? 'Creating...' : 'Start Jamming'}
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
};

export default CreateJamSessionModal;
