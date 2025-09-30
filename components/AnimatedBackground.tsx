import React from 'react';

/**
 * Renders a subtle, animated background with drifting particles.
 * Particles have random sizes, durations, and colors for a dynamic effect.
 * @returns {React.ReactElement} The animated background container.
 */
const AnimatedBackground: React.FC = () => {
    const particleCount = 50;

    const particles = Array.from({ length: particleCount }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * -20;
        const top = `${Math.random() * 100}%`;
        const left = `${Math.random() * 100}%`;
        const colorClass = i % 2 === 0 ? 'bg-[#FF6B00]' : 'bg-[#33FFD1]';

        return (
            <div
                key={i}
                className={`absolute rounded-full ${colorClass} opacity-20 animate-pulse`}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top,
                    left,
                    animation: `drift ${duration}s infinite linear`,
                    animationDelay: `${delay}s`,
                }}
            />
        );
    });

    return (
        <div className="absolute inset-0 z-0">
            <style>
                {`
                    @keyframes drift {
                        0% { transform: translate(0, 0); }
                        25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
                        50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
                        75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
                        100% { transform: translate(0, 0); }
                    }
                `}
            </style>
            {particles}
        </div>
    );
};

export default AnimatedBackground;
