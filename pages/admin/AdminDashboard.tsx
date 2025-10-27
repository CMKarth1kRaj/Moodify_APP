
import React from 'react';
import { MenuIcon } from '../../components/icons/MenuIcon';

const StatCard: React.FC<{ title: string; value: string; change?: string; }> = ({ title, value, change }) => (
    <div className="bg-dark-surface p-6 rounded-lg">
        <h3 className="text-dark-text-secondary font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {change && <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{change}</p>}
    </div>
);

const ChartPlaceholder: React.FC<{ title: string; className?: string }> = ({ title, className }) => (
    <div className={`bg-dark-surface p-6 rounded-lg ${className}`}>
        <h3 className="font-bold mb-4">{title}</h3>
        <div className="w-full h-48 bg-dark-elevated rounded-md flex items-center justify-center">
            <p className="text-dark-text-secondary text-sm">[ Chart Data ]</p>
        </div>
    </div>
);

interface AdminDashboardProps {
    openSidebar: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ openSidebar }) => {
    return (
        <div className="p-6 space-y-8">
            <header className="flex items-center gap-4">
                <button onClick={openSidebar} className="md:hidden p-2 -ml-2">
                    <MenuIcon className="h-6 w-6" />
                </button>
                <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            </header>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Users (24h)" value="1,402" change="+5.2%" />
                <StatCard title="Total Playbacks" value="2.1M" change="+12%" />
                <StatCard title="Playlists Created" value="8,934" />
                <StatCard title="Flagged Songs" value="12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartPlaceholder title="User Activity" className="lg:col-span-2" />
                <ChartPlaceholder title="Top Genres" />
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder title="Playback Stats by Mood" />
                <ChartPlaceholder title="New vs. Returning Users" />
            </div>
        </div>
    );
};

export default AdminDashboard;