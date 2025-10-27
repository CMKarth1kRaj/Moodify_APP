
import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoodifyLogo } from '../icons/MoodifyLogo';
import { DashboardIcon } from '../icons/DashboardIcon';
import { MusicIcon } from '../icons/MusicIcon';
import { TagIcon } from '../icons/TagIcon';
import { BellIcon } from '../icons/BellIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import type { AdminPage } from '../../types';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; page: AdminPage; onClick: () => void }> = ({ icon, label, page, onClick }) => {
    const { adminPage, setAdminPage } = useApp();
    const isActive = adminPage === page;

    const handleClick = () => {
        setAdminPage(page);
        onClick();
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-3 px-4 py-2 w-full text-left font-semibold transition-colors rounded ${
                isActive
                    ? 'text-white bg-dark-elevated'
                    : 'text-dark-text-secondary hover:text-white'
            }`}
        >
            {icon}
            {label}
        </button>
    );
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useApp();

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-black flex-shrink-0 flex flex-col p-4 text-white z-50 transform transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-2 mb-8 px-2">
                    <MoodifyLogo className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">Moodify Admin</span>
                </div>
                <nav className="flex flex-col gap-2">
                    <NavItem icon={<DashboardIcon className="h-5 w-5" />} label="Dashboard" page="dashboard" onClick={() => setIsOpen(false)} />
                    <NavItem icon={<MusicIcon className="h-5 w-5" />} label="Songs" page="songs" onClick={() => setIsOpen(false)} />
                    <NavItem icon={<TagIcon className="h-5 w-5" />} label="Labels & Genres" page="labels" onClick={() => setIsOpen(false)} />
                    <NavItem icon={<BellIcon className="h-5 w-5" />} label="Reports" page="reports" onClick={() => setIsOpen(false)} />
                </nav>
                <div className="mt-auto">
                    {user && (
                        <div className="flex items-center gap-3 p-2 border-t border-dark-elevated">
                            <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-full" />
                            <div>
                                <p className="font-bold text-sm">{user.username}</p>
                                <p className="text-xs text-dark-text-secondary">{user.email}</p>
                            </div>
                        </div>
                    )}
                     <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 mt-2 text-left font-semibold text-dark-text-secondary hover:text-white rounded">
                        <LogoutIcon className="h-5 w-5"/>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;