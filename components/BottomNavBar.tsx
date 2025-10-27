
import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeIcon } from './icons/HomeIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LibraryIcon } from './icons/LibraryIcon';
import { Page } from '../types';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; page: Page; }> = ({ icon, label, page }) => {
    const { currentPage, setCurrentPage } = useApp();
    const isActive = currentPage === page;

    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${
                isActive ? 'text-light-text dark:text-dark-text' : 'text-light-text-secondary dark:text-dark-text-secondary'
            }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-light-surface dark:bg-dark-elevated border-t border-light-elevated dark:border-dark-surface z-50 flex items-center justify-around lg:hidden">
            <NavItem icon={<HomeIcon className="h-6 w-6" />} label="Home" page="home" />
            <NavItem icon={<SearchIcon className="h-6 w-6" />} label="Search" page="search" />
            <NavItem icon={<LibraryIcon className="h-6 w-6" />} label="Library" page="library" />
            <NavItem icon={<SettingsIcon className="h-6 w-6" />} label="Settings" page="profile" />
        </nav>
    );
};

export default BottomNavBar;