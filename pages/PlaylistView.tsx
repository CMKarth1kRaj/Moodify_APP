
import React from 'react';
import { useApp } from '../context/AppContext';
import Spinner from '../components/Spinner';
import PlaylistHeader from '../components/PlaylistHeader';
import SongList from '../components/SongList';

const moodColors: Record<string, string> = {
    Happy: 'rgba(252, 211, 77, 0.4)',
    Calm: 'rgba(96, 165, 250, 0.4)',
    Sad: 'rgba(129, 140, 248, 0.4)',
    Energetic: 'rgba(239, 68, 68, 0.4)',
    Focused: 'rgba(34, 197, 94, 0.4)',
};

const PlaylistView: React.FC = () => {
    const { currentPlaylist, isLoading, error } = useApp();
    const [headerColor, setHeaderColor] = React.useState<string | null>(null);

     React.useEffect(() => {
        if (currentPlaylist) {
            const mood = Object.keys(moodColors).find(m => currentPlaylist.name.toLowerCase().includes(m.toLowerCase()));
            setHeaderColor(mood ? moodColors[mood] : 'rgba(83, 83, 83, 0.4)');
        }
    }, [currentPlaylist]);

    if (!currentPlaylist) {
        return (
            <div className="flex justify-center items-center h-64">
                {isLoading ? <Spinner /> : <p>Select a playlist to view its songs.</p>}
            </div>
        );
    }

    return (
         <div className="relative">
            {headerColor && (
                <div 
                    className="absolute top-0 left-0 right-0 h-80 z-0"
                    style={{ background: `linear-gradient(${headerColor}, transparent)` }}
                />
            )}
            <div className="p-6 space-y-8 pb-28 relative z-10">
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                )}
                {error && (
                     <div className="text-center text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <p><strong>Error:</strong> {error}</p>
                        <p>Please check your Gemini API key and try again.</p>
                    </div>
                )}
                {!isLoading && (
                    <div className="mt-8">
                         <PlaylistHeader playlist={currentPlaylist} />
                         {currentPlaylist.songs.length > 0 ? (
                            <SongList songs={currentPlaylist.songs} />
                         ) : (
                            <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mt-8">This playlist is empty.</p>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistView;