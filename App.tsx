import React, { useState, useEffect } from 'react';
import type { WeatherData } from './types';
import { fetchWeatherData } from './services/weatherService';
import WeatherCard from './components/WeatherCard';
import ForecastStrip from './components/ForecastStrip';
import UnifiedChart from './components/UnifiedChart';
import ImpactSection from './components/ImpactSection';
import AnimatedBackground from './components/AnimatedBackground';

/**
 * The main component for the Cosmic Forecast application.
 * It handles data fetching, loading and error states, and renders the main UI layout.
 * @returns {React.ReactElement} The rendered application component.
 */
const App: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch data for 25°20'19.3"N 49°36'01.7"E
                const data = await fetchWeatherData({ latitude: 25.3387, longitude: 49.6005 });
                setWeatherData(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch cosmic data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    /**
     * A loading spinner component displayed while data is being fetched.
     */
    const LoadingSpinner = () => (
      <div role="status" className="flex flex-col items-center justify-center h-screen text-[#EAEAEA]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FF6B00]"></div>
        <p className="mt-4 text-xl font-orbitron">Initializing Cosmic Link...</p>
      </div>
    );

    /**
     * A component to display an error message if data fetching fails.
     * @param {object} props - The component props.
     * @param {string} props.message - The error message to display.
     */
    const ErrorDisplay = ({ message }: { message: string }) => (
      <div className="flex items-center justify-center h-screen text-center text-red-400">
        <p className="text-xl">{message}</p>
      </div>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !weatherData) {
        return <ErrorDisplay message={error || "An unknown error occurred."} />;
    }

    return (
        <div className="relative min-h-screen bg-[#0D0D0D] text-[#EAEAEA] overflow-hidden">
            <AnimatedBackground />
            <main className="relative z-10 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    {/* You can personalize your app by changing the name in the title below! */}
                    <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FFD700]">
                        Your Cosmic Forecast
                    </h1>
                    <p className="text-lg text-gray-400 mt-2">Your daily link between Earth and Space weather.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <WeatherCard type="earth" data={weatherData.earth} />
                    <WeatherCard type="space" data={weatherData.space} />
                </div>

                <ForecastStrip earthForecast={weatherData.earth.forecast} spaceForecast={weatherData.space.forecast} />

                <UnifiedChart earthData={weatherData.earth} spaceData={weatherData.space} />
                
                <ImpactSection />
            </main>
        </div>
    );
};

export default App;