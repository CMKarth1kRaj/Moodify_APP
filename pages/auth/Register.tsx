
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';

const Register: React.FC = () => {
    const { register, setAuthState, isLoading, error } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        register(email, password);
    };

    return (
        <div className="min-h-screen bg-dark-bg text-white flex flex-col p-4">
            <header className="flex-shrink-0">
                <button onClick={() => setAuthState('unauthenticated')} className="flex items-center gap-2 font-bold p-2 -ml-2">
                    <ChevronLeftIcon className="h-6 w-6" />
                    Back
                </button>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-extrabold mb-6">Create an account</h1>
                    
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold">What's your email?</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 mt-1 bg-dark-surface border border-dark-elevated rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold">Create a password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 mt-1 bg-dark-surface border border-dark-elevated rounded-md"
                                required
                            />
                        </div>
                         <div>
                            <label className="text-sm font-bold">Confirm your password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 mt-1 bg-dark-surface border border-dark-elevated rounded-md"
                                required
                            />
                        </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-primary font-bold py-3 rounded-full hover:scale-105 transition-transform" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Next'}
                        </button>
                    </form>
                    <p className="text-xs text-dark-text-secondary mt-4 text-center">
                        By clicking on sign-up, you agree to Moodify's Terms and Conditions of Use.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
