import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlayButtonIcon } from '../../components/icons/PlayButtonIcon';
import { SpotifyIcon } from '../../components/icons/SpotifyIcon';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { AppleIcon } from '../../components/icons/AppleIcon';


const Login: React.FC = () => {
    const { login, setAuthState, isLoading, error } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };
    
    const handleAdminLogin = () => {
        login('admin@moodify.app', 'admin123');
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <PlayButtonIcon className="h-16 w-16 text-primary mx-auto mb-6" />
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Millions of songs.</h1>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Free on Moodify.</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-left block mb-1">Email or username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email or username"
                            className="w-full p-3 bg-dark-surface border border-dark-elevated rounded-md placeholder-dark-text-secondary"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-left block mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-3 bg-dark-surface border border-dark-elevated rounded-md placeholder-dark-text-secondary"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-[#1DB954] text-black font-bold py-3 rounded-full hover:scale-105 transition-transform" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <a href="#" className="text-sm underline font-semibold">Forgot your password?</a>
                </div>
                
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-dark-elevated"></div>
                    <span className="flex-shrink mx-4 text-dark-text-secondary text-xs font-bold">OR</span>
                    <div className="flex-grow border-t border-dark-elevated"></div>
                </div>

                 <div className="space-y-3">
                    <button className="w-full bg-[#1DB954] text-white flex items-center justify-center gap-4 font-bold py-3 rounded-full hover:scale-105 transition-transform">
                        <SpotifyIcon className="h-6 w-6" />
                        <span>Continue with Spotify</span>
                    </button>
                    <button className="w-full bg-white text-black flex items-center justify-center gap-4 font-bold py-3 rounded-full hover:scale-105 transition-transform">
                        <GoogleIcon className="h-6 w-6" />
                        <span>Continue with Google</span>
                    </button>
                    <button className="w-full bg-black border-2 border-white flex items-center justify-center gap-4 font-bold py-3 rounded-full hover:scale-105 transition-transform">
                        <AppleIcon className="h-6 w-6" />
                        <span>Continue with Apple</span>
                    </button>
                </div>
                 
                 <div className="my-6 border-t border-dark-elevated"></div>
                 
                 <div className="text-center text-sm text-dark-text-secondary">
                    <span>Don't have an account? </span>
                    <button onClick={() => setAuthState('registering')} className="font-bold text-white underline">Sign up for Moodify</button>
                 </div>
                 <div className="text-center mt-6">
                    <button onClick={handleAdminLogin} className="text-xs text-dark-text-secondary underline">
                        (Demo: Login as Admin)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;