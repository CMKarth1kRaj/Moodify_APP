
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const avatars = [
    'https://i.pravatar.cc/150?u=avatar1',
    'https://i.pravatar.cc/150?u=avatar2',
    'https://i.pravatar.cc/150?u=avatar3',
    'https://i.pravatar.cc/150?u=avatar4',
    'https://i.pravatar.cc/150?u=avatar5',
    'https://i.pravatar.cc/150?u=avatar6',
];

const ProfileSetup: React.FC = () => {
    const { completeProfileSetup, isLoading } = useApp();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            completeProfileSetup(username, selectedAvatar, bio);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
                <h1 className="text-3xl font-extrabold mb-2">Welcome to Moodify!</h1>
                <p className="text-dark-text-secondary mb-8">Let's set up your profile.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-lg font-bold mb-4 block">Choose your avatar</label>
                        <div className="flex justify-center flex-wrap gap-3">
                            {avatars.map(avatarUrl => (
                                <button
                                    key={avatarUrl}
                                    type="button"
                                    onClick={() => setSelectedAvatar(avatarUrl)}
                                    className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${selectedAvatar === avatarUrl ? 'border-primary scale-110' : 'border-transparent'}`}
                                >
                                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-left">
                        <label className="text-sm font-bold">What should we call you?</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter a profile name"
                            className="w-full p-3 mt-1 bg-dark-surface border border-dark-elevated rounded-md"
                            required
                        />
                    </div>
                     <div className="text-left">
                        <label className="text-sm font-bold">Bio (optional)</label>
                         <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            placeholder="Tell us a little about yourself"
                            className="w-full p-3 mt-1 bg-dark-surface border border-dark-elevated rounded-md"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary font-bold py-3 rounded-full hover:scale-105 transition-transform" disabled={isLoading || !username.trim()}>
                        {isLoading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
