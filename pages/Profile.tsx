
import React from 'react';
import { useApp } from '../context/AppContext';
import type { ThemePreference } from '../types';
import { LogoutIcon } from '../components/icons/LogoutIcon';

const Profile: React.FC = () => {
    const { user, logout, themePreference, setThemePreference } = useApp();

    if (!user) {
        return (
            <div className="p-6 text-center">
                <p>Not logged in.</p>
                <button onClick={logout} className="mt-4 px-4 py-2 bg-primary text-white rounded">Go to Login</button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto pb-28">
            <header className="flex flex-col items-center text-center mb-10">
                <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full mb-4" />
                <h1 className="text-4xl font-extrabold tracking-tight">{user.username}</h1>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">{user.email}</p>
                {user.bio && <p className="mt-2 max-w-prose">{user.bio}</p>}
                 <button className="mt-4 text-sm font-bold border border-light-elevated dark:border-dark-elevated px-4 py-1.5 rounded-full hover:bg-light-surface dark:hover:bg-dark-surface">
                    Edit Profile
                </button>
            </header>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold border-b border-light-elevated dark:border-dark-elevated pb-2">Settings</h2>
                <div>
                    <label className="block font-semibold mb-2">Theme</label>
                    <div className="flex space-x-2 p-1 bg-light-elevated dark:bg-dark-elevated rounded-lg">
                        {(['light', 'dark', 'system'] as ThemePreference[]).map(theme => (
                            <button
                                key={theme}
                                onClick={() => setThemePreference(theme)}
                                className={`w-full py-2 px-4 rounded-md font-semibold transition-colors capitalize ${
                                    themePreference === theme
                                        ? 'bg-primary text-white shadow'
                                        : 'hover:bg-light-surface dark:hover:bg-dark-surface'
                                }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            
            <div className="border-t border-light-elevated dark:border-dark-elevated my-10"></div>
            
            <section className="space-y-6">
                 <h2 className="text-2xl font-bold border-b border-light-elevated dark:border-dark-elevated pb-2">Playback</h2>
                 <div className="flex items-center justify-between">
                    <label htmlFor="autoplay" className="font-semibold">Autoplay similar songs</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="autoplay" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-light-elevated peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer dark:bg-dark-elevated peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </section>


            <div className="border-t border-light-elevated dark:border-dark-elevated my-10"></div>

            <section>
                 <button 
                    onClick={logout}
                    className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-light-surface dark:bg-dark-surface font-semibold rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <LogoutIcon className="h-5 w-5"/>
                    Sign Out
                </button>
            </section>
        </div>
    );
};

export default Profile;
