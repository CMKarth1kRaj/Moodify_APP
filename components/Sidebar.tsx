
import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeIcon } from './icons/HomeIcon';
import { SearchIcon } from './icons/SearchIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MoodifyLogo } from './icons/MoodifyLogo';
import type { Page, Playlist } from '../types';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; page: Page; isHeader?: boolean; }> = ({ icon, label, page, isHeader = false }) => {
    const { currentPage, setCurrentPage } = useApp();
    const isActive = currentPage === page;

    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex items-center gap-4 px-6 h-10 w-full text-left font-bold transition-colors rounded ${
                isActive
                    ? 'text-light-text dark:text-dark-text'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
            } ${isHeader ? 'text-lg' : 'text-sm'}`}
        >
            {icon}
            {label}
        </button>
    );
};

const PlaylistNavItem: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
    const { currentPlaylist, setCurrentPlaylist, setCurrentPage, currentPage } = useApp();
    const isActive = (currentPlaylist?.id === playlist.id && currentPage === 'playlist') || (playlist.id === 'liked-songs' && currentPage === 'likedSongs');
    
    const handlePlaylistClick = () => {
        if (playlist.id === 'liked-songs') {
            setCurrentPage('likedSongs');
        } else {
            setCurrentPlaylist(playlist);
            setCurrentPage('playlist');
        }
    };

    return (
        <button onClick={handlePlaylistClick} className={`px-6 py-1.5 text-left text-sm w-full truncate rounded ${isActive ? 'text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface' : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'}`}>
            {playlist.name}
        </button>
    )
}

const Sidebar: React.FC = () => {
    const { userPlaylists, setCurrentPage } = useApp();
    const likedSongs = userPlaylists.find(p => p.id === 'liked-songs');
    const customPlaylists = userPlaylists.filter(p => p.id !== 'liked-songs');

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-black flex-shrink-0">
             <div className="p-6">
                <div className="flex items-center gap-2">
                    <MoodifyLogo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-white">Moodify</span>
                </div>
            </div>
            <nav className="flex flex-col gap-2 p-2">
                <NavItem icon={<HomeIcon className="h-6 w-6" />} label="Home" page="home" />
                <NavItem icon={<SearchIcon className="h-6 w-6" />} label="Search" page="search" />
                <NavItem icon={<LibraryIcon className="h-6 w-6" />} label="Your Library" page="library" />
            </nav>

            <div className="flex-1 flex flex-col mt-4 overflow-hidden">
                <div className="px-6 flex items-center justify-between">
                     <span className="font-bold text-sm text-dark-text-secondary">PLAYLISTS</span>
                    <button onClick={() => setCurrentPage('library')} className="text-dark-text-secondary hover:text-white p-1">
                        <PlusIcon className="h-5 w-5"/>
                    </button>
                </div>
                 <div className="flex-1 overflow-y-auto px-2 pb-4 mt-2 space-y-1">
                    {likedSongs && <PlaylistNavItem playlist={likedSongs} />}
                    {customPlaylists.map(playlist => (
                        <PlaylistNavItem key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
