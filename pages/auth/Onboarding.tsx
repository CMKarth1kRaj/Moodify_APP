import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MusicIcon } from '../../components/icons/MusicIcon';
import { UsersIcon } from '../../components/icons/UsersIcon';
import { MoodifyLogo } from '../../components/icons/MoodifyLogo';

interface OnboardingStep {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const steps: OnboardingStep[] = [
    {
        icon: <MoodifyLogo className="h-16 w-16 text-primary" />,
        title: "Welcome to Moodify",
        description: "Your personal universe of music, powered by AI. Let's find the perfect soundtrack for every moment."
    },
    {
        icon: <MusicIcon className="h-16 w-16 text-primary" />,
        title: "Discover Your Vibe",
        description: "Tell us how you feel, and our AI will instantly craft a personalized playlist just for you."
    },
    {
        icon: <UsersIcon className="h-16 w-16 text-primary" />,
        title: "Jam with Friends",
        description: "Create or join live listening sessions. Share music and react in real-time with people from anywhere."
    }
];

const Onboarding: React.FC = () => {
    const { completeOnboarding } = useApp();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
        }
    };

    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-between p-8 text-center">
            <header className="w-full flex justify-end">
                <button onClick={completeOnboarding} className="font-semibold text-dark-text-secondary hover:text-white">
                    Skip
                </button>
            </header>

            <main className="flex flex-col items-center">
                <div className="mb-8">{steps[currentStep].icon}</div>
                <h1 className="text-3xl font-extrabold mb-4">{steps[currentStep].title}</h1>
                <p className="max-w-xs text-dark-text-secondary">{steps[currentStep].description}</p>
            </main>

            <footer className="w-full max-w-xs">
                <div className="flex justify-center gap-2 mb-8">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                                index === currentStep ? 'w-6 bg-primary' : 'w-2 bg-dark-elevated'
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="w-full bg-primary text-white font-bold py-3 rounded-full hover:scale-105 transition-transform"
                >
                    {isLastStep ? "Get Started" : "Next"}
                </button>
            </footer>
        </div>
    );
};

export default Onboarding;