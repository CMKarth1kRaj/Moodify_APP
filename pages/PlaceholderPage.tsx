import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="max-w-md">
                <h1 className="text-5xl font-extrabold tracking-tighter">{title}</h1>
                <p className="mt-4 text-lg text-light-text-secondary dark:text-dark-text-secondary">
                    This feature is coming soon! Stay tuned for more updates.
                </p>
            </div>
        </div>
    );
};

export default PlaceholderPage;