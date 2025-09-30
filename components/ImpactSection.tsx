import React from 'react';

/**
 * Props for the ImpactCard component.
 */
interface ImpactCardProps {
    title: string;
    description: string;
    icon: string;
    borderColor: string;
}

/**
 * A single card displaying information about weather impacts.
 * @param {ImpactCardProps} props - The component props.
 */
const ImpactCard: React.FC<ImpactCardProps> = ({ title, description, icon, borderColor }) => (
    <div className={`flex-shrink-0 w-full md:w-1/2 p-6 rounded-lg bg-white/5 border-l-4 ${borderColor}`}>
        <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">{icon}</span>
            <h4 className="text-xl font-bold font-orbitron">{title}</h4>
        </div>
        <p className="text-gray-300">{description}</p>
    </div>
);

/**
 * An educational section explaining the real-world impacts of Earth and Space weather.
 * It uses a horizontally scrollable view to present the information.
 * @returns {React.ReactElement} The rendered impact section.
 */
const ImpactSection: React.FC = () => {
    return (
        <div className="text-center">
            <h3 className="text-2xl font-bold font-orbitron mb-4">How Does It Affect Us?</h3>
            <p className="text-gray-400 mb-6">Scroll to see the daily impact of weather on Earth and in Space.</p>
            <div className="flex overflow-x-auto space-x-6 pb-4 scroll-snap-x mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <ImpactCard 
                    title="Earth Weather Impacts"
                    icon="🧥"
                    borderColor="border-teal-400"
                    description="Earth's weather dictates our daily lives, from the clothes we wear to our travel plans. High winds can disrupt flights, while rain nourishes crops. Understanding it helps us plan and stay safe."
                />
                <ImpactCard 
                    title="Space Weather Impacts"
                    icon="🛰️"
                    borderColor="border-orange-500"
                    description="Space weather, like solar flares and geomagnetic storms, can impact technology on Earth and in orbit. It can disrupt GPS signals, damage satellites, and even pose risks to astronauts and power grids on the ground."
                />
            </div>
        </div>
    );
};

export default ImpactSection;
