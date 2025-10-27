import React, { useEffect, useState, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';
import Home from './pages/Home';
import PlaylistView from './pages/PlaylistView';
import NowPlaying from './pages/NowPlaying';
import Search from './pages/Search';
import PlaceholderPage from './pages/PlaceholderPage';
import Library from './pages/Library';
import Profile from './pages/Profile';
import BottomNavBar from './components/BottomNavBar';
import Splash from './pages/Splash';
import Onboarding from './pages/auth/Onboarding';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfileSetup from './pages/auth/ProfileSetup';
import AdminLayout from './components/admin/AdminLayout';
import type { Page } from './types';


const AppPages: React.FC = () => {
    const { currentPage, currentPlaylist, setCurrentPlaylist, userPlaylists, isPlayerExpanded } = useApp();
    const [headerOpacity, setHeaderOpacity] = useState(0);
    const mainContentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const mainEl = mainContentRef.current;
        const handleScroll = () => {
            if (mainEl) {
                const scrollY = mainEl.scrollTop;
                const opacity = Math.min(scrollY / 150, 1);
                setHeaderOpacity(opacity);
            }
        };

        if (mainEl) {
            mainEl.addEventListener('scroll', handleScroll);
            handleScroll(); // Set initial opacity
        }
        return () => {
            if (mainEl) {
                mainEl.removeEventListener('scroll', handleScroll);
            }
        };
    }, [currentPage]); // Re-attach scroll listener when page changes


    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'playlist':
                return <PlaylistView />;
            case 'search':
                return <Search />;
            case 'library':
                return <Library />;
             case 'profile':
                return <Profile />;
            case 'likedSongs':
                if (currentPlaylist?.id !== 'liked-songs') {
                  const likedSongs = userPlaylists.find(p => p.id === 'liked-songs');
                  if (likedSongs) setCurrentPlaylist(likedSongs);
                }
                return <PlaylistView />;
            default:
                return <Home />;
        }
    };
    
    const hasMusicPlayer = !!currentPlaylist?.songs.length;
    const mainContentPadding = hasMusicPlayer ? 'pb-44 lg:pb-28' : 'pb-24 lg:pb-4';

    return (
        <div className="h-screen w-screen flex bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden">
            <Sidebar />
            <main ref={mainContentRef} className="flex-1 flex flex-col h-screen overflow-y-auto relative">
                <Header showSearch={currentPage === 'home' || currentPage === 'search'} opacity={headerOpacity} />
                <div className={`flex-1 overflow-y-auto ${mainContentPadding}`}>
                    {renderPage()}
                </div>
            </main>
            {hasMusicPlayer && <MusicPlayer />}
            {isPlayerExpanded && <NowPlaying />}
            <BottomNavBar />
        </div>
    );
}


const AppContent: React.FC = () => {
    const { themePreference, authState, isAdmin } = useApp();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (themePreference === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(themePreference);
        }
    }, [themePreference]);
    
    switch (authState) {
        case 'loading':
            return <Splash />;
        case 'onboarding':
            return <Onboarding />;
        case 'unauthenticated':
            return <Login />;
        case 'registering':
            return <Register />;
        case 'profile_setup':
            return <ProfileSetup />;
        case 'authenticated':
            if (isAdmin) {
                return <AdminLayout />;
            }
            return <AppPages />;
        default:
            return <Splash />;
    }
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;