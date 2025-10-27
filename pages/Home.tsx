
import React from 'react';
import { useApp } from '../context/AppContext';
import GreetingCard from '../components/GreetingCard';
import HomeGridCard from '../components/HomeGridCard';
import MoodCard from '../components/MoodCard';
import type { Mood, Playlist, JamSession } from '../types';

const JamCard: React.FC<{item: JamSession, onClick: () => void}> = ({item, onClick}) => {
    return (
        <button onClick={onClick} className="flex flex-col text-left group">
            <div className="relative">
                <img src={item.playlist.coverArt} className="w-full h-auto rounded-lg shadow-lg aspect-square object-cover" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-blink"></div>
                    <span className="text-xs font-bold">LIVE</span>
                </div>
            </div>
             <p className="font-bold truncate mt-2 group-hover:underline">{item.name}</p>
             <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">Hosted by {item.createdBy.username}</p>
        </button>
    )
}

const Home: React.FC = () => {
    const { userPlaylists, setCurrentPlaylist, setCurrentPage, getMoodPlaylist, isLoading, jamSessions, joinJamSession, user } = useApp();
    
    const handlePlaylistClick = (playlist: Playlist) => {
        if (playlist.id === 'liked-songs') {
            setCurrentPage('likedSongs');
        } else {
            setCurrentPlaylist(playlist);
            setCurrentPage('playlist');
        }
    };
    
    const handleMoodClick = (mood: Mood) => {
        if (!isLoading) {
            getMoodPlaylist(mood);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };
    
    const greetingPlaylists = userPlaylists.slice(0, 6);

    return (
        <div className="p-4 md:p-6 space-y-8 pb-28">
            <div>
                <h1 className="text-3xl font-bold">{getGreeting()}, {user?.username || 'Guest'}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {greetingPlaylists.map(playlist => (
                        <GreetingCard key={playlist.id} item={playlist} onClick={() => handlePlaylistClick(playlist)} />
                    ))}
                </div>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
                 <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 md:-mx-6 px-4 md:px-6">
                    {(['Happy', 'Calm', 'Sad', 'Energetic', 'Focused'] as Mood[]).map(mood => (
                         <div key={mood} className="w-56 flex-shrink-0">
                            <MoodCard mood={mood} onClick={() => handleMoodClick(mood)} disabled={isLoading} />
                         </div>
                    ))}
                 </div>
            </div>

            {jamSessions.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Live Jams Happening Now</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {jamSessions.map(session => (
                            <JamCard key={session.id} item={session} onClick={() => joinJamSession(session.id)} />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                     {userPlaylists.filter(p => p.id !== 'liked-songs').map(playlist => (
                        <HomeGridCard key={playlist.id} item={playlist} onClick={() => handlePlaylistClick(playlist)} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;