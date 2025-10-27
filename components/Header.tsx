import React from 'react';
import { useApp } from '../context/AppContext';
import { SearchIcon } from './icons/SearchIcon';
import { UserIcon } from './icons/UserIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface HeaderProps {
    opacity: number;
    showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ opacity, showSearch = false }) => {
    const { searchTerm, setSearchTerm, setCurrentPage } = useApp();

    return (
        <header 
            className="sticky top-0 p-4 flex items-center justify-between z-40 flex-shrink-0 transition-colors duration-300"
            style={{ 
                backgroundColor: `rgba(249, 249, 249, ${opacity})` 
            }}
        >
             <style>{`:root.dark header { background-color: rgba(18, 18, 18, ${opacity}); }`}</style>
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                     <button className="p-1.5 bg-black/10 dark:bg-black/30 rounded-full text-light-text dark:text-dark-text opacity-50 cursor-not-allowed">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button className="p-1.5 bg-black/10 dark:bg-black/30 rounded-full text-light-text dark:text-dark-text opacity-50 cursor-not-allowed">
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {showSearch && (
                <div className="flex-1 max-w-lg mx-4 hidden sm:block">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-light-elevated dark:bg-dark-elevated rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage('profile')} className="p-1.5 bg-black/20 dark:bg-black/40 rounded-full text-light-text dark:text-dark-text hover:bg-black/30 dark:hover:bg-black/60">
                    <UserIcon className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;