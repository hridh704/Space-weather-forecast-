import React from 'react';
import type { EarthWeatherData, SpaceWeatherData } from '../types';
import MetricDisplay from './MetricDisplay';
import { ThermometerIcon, WindIcon, DropletsIcon, GaugeIcon, SunIcon } from './icons';

/**
 * Props for the WeatherCard component.
 * Uses a discriminated union to ensure data matches the card type.
 */
type WeatherCardProps = 
    | { type: 'earth'; data: EarthWeatherData }
    | { type: 'space'; data: SpaceWeatherData };

/**
 * A card component that displays either Earth or Space weather data.
 * It adapts its title, colors, and metrics based on the `type` prop.
 * @param {WeatherCardProps} props - The component props.
 * @returns {React.ReactElement} The rendered weather card.
 */
const WeatherCard: React.FC<WeatherCardProps> = ({ type, data }) => {
    const isEarth = type === 'earth';
    const cardConfig = {
        earth: {
            title: 'Earth Weather',
            icon: '🌍',
            glowColor: 'shadow-[#33FFD1]',
            borderColor: 'border-[#33FFD1]',
        },
        space: {
            title: 'Space Weather',
            icon: '☀️',
            glowColor: 'shadow-[#FF6B00]',
            borderColor: 'border-[#FF6B00]',
        },
    };
    
    const config = cardConfig[type];
    const cardData = data;

    return (
        <div className={`bg-black/30 backdrop-blur-lg rounded-2xl p-6 border ${config.borderColor} shadow-lg ${config.glowColor}/40 transition-shadow duration-300 hover:shadow-2xl hover:${config.glowColor}/60`}>
            <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">{config.icon}</span>
                <h2 className="text-3xl font-bold font-orbitron">{config.title}</h2>
            </div>
            
            <div className="space-y-4">
                {isEarth && 'location' in cardData && (
                    <div className="flex items-center justify-between text-lg">
                        <span className="text-gray-400">Location</span>
                        <span className="font-semibold">{cardData.location}</span>
                    </div>
                )}
                
                {isEarth && 'condition' in cardData && (
                    <div className="flex flex-col items-center py-4">
                         <cardData.icon className="w-20 h-20 text-white" />
                         <p className="text-2xl mt-2">{cardData.condition}</p>
                    </div>
                )}
                
                {isEarth && 'temperature' in cardData && <MetricDisplay icon={ThermometerIcon} label="Temperature" value={`${cardData.temperature}°C`} tooltip="Air temperature on the surface." />}
                {isEarth && 'windSpeed' in cardData && <MetricDisplay icon={WindIcon} label="Wind Speed" value={`${cardData.windSpeed} km/h`} tooltip="Speed of horizontal air motion." />}
                {isEarth && 'humidity' in cardData && <MetricDisplay icon={DropletsIcon} label="Humidity" value={`${cardData.humidity}%`} tooltip="Amount of water vapor in the air." />}

                {!isEarth && 'solarWindSpeed' in cardData && <MetricDisplay icon={WindIcon} label="Solar Wind" value={`${cardData.solarWindSpeed} km/s`} tooltip="Stream of charged particles from the Sun." />}
                {!isEarth && 'kpIndex' in cardData && <MetricDisplay icon={GaugeIcon} label="Kp-index" value={`${cardData.kpIndex}`} tooltip="Global geomagnetic activity index." />}
                {!isEarth && 'cmeCount' in cardData && <MetricDisplay icon={SunIcon} label="Recent CMEs" value={`${cardData.cmeCount}`} tooltip="Coronal Mass Ejections in last 24h." />}
            </div>
        </div>
    );
};

export default WeatherCard;
