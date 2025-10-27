
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Song } from '../../types';

interface SongFormModalProps {
    song: Song | null;
    onClose: () => void;
}

const SongFormModal: React.FC<SongFormModalProps> = ({ song, onClose }) => {
    const { addSong, updateSong } = useApp();
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        album: '',
        genre: '',
        coverArt: '',
        previewUrl: '',
        duration: 180,
        lyrics: '',
    });

    useEffect(() => {
        if (song) {
            setFormData({
                title: song.title,
                artist: song.artist,
                album: song.album,
                genre: song.genre || '',
                coverArt: song.coverArt,
                previewUrl: song.previewUrl,
                duration: song.duration,
                lyrics: song.lyrics || '',
            });
        }
    }, [song]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const songData = {
            ...formData,
            duration: Number(formData.duration)
        };
        if (song) {
            updateSong({ ...song, ...songData });
        } else {
            addSong(songData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-dark-surface rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{song ? 'Edit Song' : 'Add New Song'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-dark-elevated" required />
                        <input name="artist" value={formData.artist} onChange={handleChange} placeholder="Artist" className="w-full p-2 rounded bg-dark-elevated" required />
                        <input name="album" value={formData.album} onChange={handleChange} placeholder="Album" className="w-full p-2 rounded bg-dark-elevated" />
                        <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="w-full p-2 rounded bg-dark-elevated" />
                        <input name="coverArt" value={formData.coverArt} onChange={handleChange} placeholder="Cover Art URL" className="w-full p-2 rounded bg-dark-elevated md:col-span-2" />
                        <input name="previewUrl" value={formData.previewUrl} onChange={handleChange} placeholder="Preview URL" className="w-full p-2 rounded bg-dark-elevated md:col-span-2" />
                        <div>
                           <label className="text-sm text-dark-text-secondary">Duration (seconds)</label>
                           <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (seconds)" className="w-full p-2 rounded bg-dark-elevated" />
                        </div>
                    </div>
                    <textarea name="lyrics" value={formData.lyrics} onChange={handleChange} rows={5} placeholder="Lyrics" className="w-full p-2 rounded bg-dark-elevated" />
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded font-semibold hover:bg-dark-elevated">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-full font-bold">{song ? 'Save Changes' : 'Add Song'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SongFormModal;
