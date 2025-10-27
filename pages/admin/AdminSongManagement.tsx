
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Song } from '../../types';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { EditIcon } from '../../components/icons/EditIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import SongFormModal from '../../components/admin/SongFormModal';
import { MenuIcon } from '../../components/icons/MenuIcon';

interface AdminSongManagementProps {
    openSidebar: () => void;
}

const AdminSongManagement: React.FC<AdminSongManagementProps> = ({ openSidebar }) => {
    const { songs, deleteSong } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSong, setEditingSong] = useState<Song | null>(null);

    const handleAddNew = () => {
        setEditingSong(null);
        setIsModalOpen(true);
    };

    const handleEdit = (song: Song) => {
        setEditingSong(song);
        setIsModalOpen(true);
    };

    const handleDelete = (songId: number) => {
        if (window.confirm('Are you sure you want to delete this song?')) {
            deleteSong(songId);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {isModalOpen && <SongFormModal song={editingSong} onClose={() => setIsModalOpen(false)} />}
            <header className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <button onClick={openSidebar} className="md:hidden p-2 -ml-2">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Songs</h1>
                 </div>
                <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:scale-105 transition-transform">
                    <PlusIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">Add New Song</span>
                </button>
            </header>

            {/* Desktop Table View */}
            <div className="bg-dark-surface rounded-lg overflow-x-auto hidden md:block">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-dark-elevated">
                        <tr>
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold">Artist</th>
                            <th className="p-4 font-semibold">Album</th>
                            <th className="p-4 font-semibold">Genre</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map(song => (
                            <tr key={song.id} className="border-b border-dark-elevated last:border-b-0">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-md object-cover" />
                                    <span className="font-bold">{song.title}</span>
                                </td>
                                <td className="p-4 text-dark-text-secondary">{song.artist}</td>
                                <td className="p-4 text-dark-text-secondary truncate">{song.album}</td>
                                <td className="p-4 text-dark-text-secondary">{song.genre}</td>
                                <td className="p-4 text-right">
                                    <div className="inline-flex gap-2">
                                        <button onClick={() => handleEdit(song)} className="p-2 text-dark-text-secondary hover:text-white">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(song.id)} className="p-2 text-dark-text-secondary hover:text-red-500">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-3 md:hidden">
                {songs.map(song => (
                    <div key={song.id} className="bg-dark-surface rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold truncate">{song.title}</p>
                                <p className="text-sm text-dark-text-secondary truncate">{song.artist}</p>
                            </div>
                             <div className="flex gap-1">
                                <button onClick={() => handleEdit(song)} className="p-2 text-dark-text-secondary hover:text-white">
                                    <EditIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => handleDelete(song.id)} className="p-2 text-dark-text-secondary hover:text-red-500">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSongManagement;