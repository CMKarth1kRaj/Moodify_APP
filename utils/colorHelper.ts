// Fix: Import React to resolve 'React' namespace error for CSSProperties type.
import React from 'react';


const greetingGradients = [
    'from-indigo-700 to-purple-500',
    'from-green-700 to-cyan-500',
    'from-red-700 to-orange-500',
    'from-pink-700 to-rose-500',
    'from-teal-700 to-lime-500',
    'from-fuchsia-700 to-cyan-500',
    'from-amber-700 to-yellow-500',
    'from-violet-800 to-indigo-600',
];

const playlistBgs = [
    'bg-[#503E60]',
    'bg-[#1E3264]',
    'bg-[#842424]',
    'bg-[#E8115B]',
    'bg-[#148A08]',
    'bg-[#5F3D20]',
    'bg-[#B45F06]',
    'bg-[#4C1E4E]',
]

const hashString = (str: string): number => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export const getGreetingCardGradient = (seed: string): string => {
    const index = hashString(seed) % greetingGradients.length;
    return greetingGradients[index];
};

export const getPlaylistCardBg = (seed: string): string => {
    // We can't use arbitrary values with Tailwind JIT in this environment,
    // so we'll use a trick. We'll return a static class and use a style tag.
    // In a real app with a build step, you could configure safelists.
    // For now, let's just use a predefined set of dark backgrounds from the Spotify palette
    const index = hashString(seed) % playlistBgs.length;
    return 'bg-dark-elevated'; // Fallback
};

// A better approach if arbitrary values were allowed:
export const getPlaylistCardBgStyle = (seed: string): React.CSSProperties => {
    const index = hashString(seed) % playlistBgs.length;
    return { backgroundColor: playlistBgs[index].slice(3, -1) }; // e.g., #503E60
}