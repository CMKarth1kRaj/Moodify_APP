
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminSongManagement from '../../pages/admin/AdminSongManagement';
import PlaceholderPage from '../../pages/PlaceholderPage';

const AdminLayout: React.FC = () => {
    const { adminPage } = useApp();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderAdminPage = () => {
        switch (adminPage) {
            case 'dashboard':
                return <AdminDashboard openSidebar={() => setIsSidebarOpen(true)} />;
            case 'songs':
                return <AdminSongManagement openSidebar={() => setIsSidebarOpen(true)} />;
            case 'labels':
                return <PlaceholderPage title="Label & Category Management" />;
            case 'reports':
                return <PlaceholderPage title="Notifications & Reports" />;
            default:
                return <AdminDashboard openSidebar={() => setIsSidebarOpen(true)} />;
        }
    };

    return (
        <div className="h-screen w-screen flex bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {renderAdminPage()}
            </main>
        </div>
    );
};

export default AdminLayout;