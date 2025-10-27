
import React from 'react';
import { MoodifyLogo } from '../components/icons/MoodifyLogo';

const Splash: React.FC = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-dark-bg text-white">
            <div className="relative">
                <MoodifyLogo className="h-24 w-24 text-primary animate-pulse" />
            </div>
            <p className="mt-4 text-lg font-semibold tracking-wider">Moodify</p>
        </div>
    );
};

export default Splash;
