import React from 'react';
import type { EarthForecast, SpaceForecast } from '../types';

/**
 * Props for the ForecastStrip component.
 */
interface ForecastStripProps {
    /** An array of Earth forecast data for the next 7 days. */
    earthForecast: EarthForecast[];
    /** An array of Space forecast data for the next 7 days. */
    spaceForecast: SpaceForecast[];
}

/**
 * A horizontally scrollable component that displays a 7-day forecast.
 * Each card in the strip shows a combined summary of Earth and Space weather.
 * @param {ForecastStripProps} props - The component props.
 * @returns {React.ReactElement} The rendered forecast strip.
 */
const ForecastStrip: React.FC<ForecastStripProps> = ({ earthForecast, spaceForecast }) => {
    return (
        <div className="mb-8">
            <h3 className="text-2xl font-bold font-orbitron mb-4 text-center">7-Day Forecast</h3>
            <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {earthForecast.map((earthDay, index) => {
                    const spaceDay = spaceForecast[index];
                    const Icon = earthDay.icon;
                    return (
                        <div key={index} className="flex-shrink-0 w-48 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-gray-700 text-center transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/30">
                            <h4 className="font-bold text-xl mb-3">{earthDay.day}</h4>
                            <div className="space-y-3">
                                <div className="text-center">
                                    <span className="text-teal-400 text-sm">Earth</span>
                                    <div className="flex items-center justify-center space-x-2 mt-1">
                                      <Icon className="w-8 h-8"/>
                                      <p className="text-lg font-semibold">{earthDay.temperature}°C</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-700 my-2"></div>
                                <div className="text-center">
                                    <span className="text-orange-400 text-sm">Space</span>
                                    <div className="flex flex-col items-center mt-1">
                                      <p className="text-base">Wind: {spaceDay.solarWindSpeed} km/s</p>
                                      <p className="text-base">Kp: {spaceDay.kpIndex}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ForecastStrip;
