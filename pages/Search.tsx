
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SongList from '../components/SongList';
import { Song, Playlist } from '../types';
import { searchSongs } from '../services/youtubeMusicService';
import Spinner from '../components/Spinner';

const Search: React.FC = () => {
    const { searchTerm, setSearchTerm } = useApp();
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (searchTerm.trim() === '') {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            const results = await searchSongs(searchTerm);
            setSearchResults(results);
            setIsSearching(false);
        };

        const debounceTimer = setTimeout(() => {
            performSearch();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const searchPlaylist: Playlist = {
        id: 'search-results',
        name: `Results for "${searchTerm}"`,
        songs: searchResults,
        coverArt: '',
    };
    
    const trendingQueries = ["Top Hits 2024", "Workout Beats", "Indie Chill", "Classic Rock"];

    return (
        <div className="p-6 space-y-8 pb-28">
             <div className="sm:hidden mb-4">
                 <input
                    type="text"
                    placeholder="What do you want to play?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-light-elevated dark:bg-dark-elevated rounded-full py-2.5 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            
            {isSearching ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-2 text-sm">Searching...</p>
                    </div>
                </div>
            ) : searchTerm ? (
                searchResults.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Top Results for "{searchTerm}"</h2>
                        <SongList songs={searchResults} playlist={searchPlaylist} />
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">No results found</h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">Please check the spelling or try another search.</p>
                    </div>
                )
            ) : (
                 <>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Recent Searches</h2>
                        <div className="flex flex-wrap gap-2">
                             <span className="bg-light-surface dark:bg-dark-surface px-3 py-1 rounded-full text-sm">Chill Vibes</span>
                             <span className="bg-light-surface dark:bg-dark-surface px-3 py-1 rounded-full text-sm">Tame Impala</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
                        <div className="flex flex-wrap gap-2">
                            {trendingQueries.map(q => (
                                <button key={q} onClick={() => setSearchTerm(q)} className="bg-light-surface dark:bg-dark-surface px-3 py-1 rounded-full text-sm hover:bg-light-elevated dark:hover:bg-dark-elevated">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                 </>
            )}
        </div>
    );
};

export default Search;
