
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Playlist, JamSession, Mood } from '../types';
import PlaylistCoverArt from '../components/PlaylistCoverArt';
import { PlusIcon } from '../components/icons/PlusIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import CreateJamSessionModal from '../components/CreateJamSessionModal';


const PlaylistListItem: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
    const { setCurrentPlaylist, setCurrentPage } = useApp();
    const handlePlaylistClick = () => {
        if (playlist.id === 'liked-songs') {
            setCurrentPage('likedSongs');
        } else {
            setCurrentPlaylist(playlist);
            setCurrentPage('playlist');
        }
    };
    return (
        <button onClick={handlePlaylistClick} className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface">
            <PlaylistCoverArt playlist={playlist} className="w-16 h-16 rounded-md flex-shrink-0" />
            <div className="text-left">
                <p className="font-bold">{playlist.name}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{playlist.songs.length} songs</p>
            </div>
        </button>
    );
};

const CreatePlaylistModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { createPlaylist } = useApp();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            createPlaylist(name.trim(), description.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-light-surface dark:bg-dark-elevated rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-center">Create a new playlist</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Playlist Name" className="w-full p-3 rounded bg-light-elevated dark:bg-dark-surface" required />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Add an optional description" className="w-full p-3 rounded bg-light-elevated dark:bg-dark-surface" />
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded font-semibold">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-full font-bold" disabled={!name.trim()}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Library: React.FC = () => {
    const { userPlaylists, jamSessions, joinJamSession, isLoading } = useApp();
    const [activeTab, setActiveTab] = useState<'playlists' | 'jams'>('playlists');
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [showCreateJam, setShowCreateJam] = useState(false);

    return (
        <div className="p-6 space-y-6 pb-28">
            {showCreatePlaylist && <CreatePlaylistModal onClose={() => setShowCreatePlaylist(false)} />}
            {showCreateJam && <CreateJamSessionModal onClose={() => setShowCreateJam(false)} />}

            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-tighter">Your Library</h1>
                <button onClick={() => activeTab === 'playlists' ? setShowCreatePlaylist(true) : setShowCreateJam(true)} className="p-2">
                    <PlusIcon className="h-6 w-6" />
                </button>
            </header>
            
            <div className="flex items-center gap-2">
                 <button onClick={() => setActiveTab('playlists')} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${activeTab === 'playlists' ? 'bg-primary text-white' : 'bg-light-surface dark:bg-dark-surface'}`}>
                    Playlists
                </button>
                 <button onClick={() => setActiveTab('jams')} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${activeTab === 'jams' ? 'bg-primary text-white' : 'bg-light-surface dark:bg-dark-surface'}`}>
                    Jam Sessions
                </button>
            </div>

            <div>
                {activeTab === 'playlists' ? (
                     <div className="space-y-2">
                        {userPlaylists.map(pl => <PlaylistListItem key={pl.id} playlist={pl} />)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button onClick={() => setShowCreateJam(true)} className="w-full p-4 bg-light-surface dark:bg-dark-surface rounded-lg font-bold text-center hover:bg-light-elevated dark:hover:bg-dark-elevated transition-colors">
                            Create a new Jam Session
                        </button>
                         {jamSessions.length > 0 ? jamSessions.map(session => (
                            <div key={session.id} className="w-full flex items-center gap-4 p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                                <img src={session.playlist.coverArt} alt={session.playlist.name} className="h-16 w-16 rounded-md object-cover"/>
                                <div className="flex-1 text-left">
                                    <p className="font-bold text-lg">{session.name}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-blink"></div>
                                        <span className="text-xs font-bold text-red-500">LIVE</span>
                                    </div>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">Mood: {session.mood}</p>
                                </div>
                                <div className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
                                    <UsersIcon className="h-5 w-5" />
                                    <span>{session.participants.length}/{session.participantLimit}</span>
                                </div>
                                <button onClick={() => joinJamSession(session.id)} className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform">Join</button>
                            </div>
                         )) : (
                             <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-8">No public sessions right now. Be the first to start one!</p>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;