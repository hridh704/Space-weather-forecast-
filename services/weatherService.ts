
import React from 'react';
import type { WeatherData, EarthWeatherData, SpaceWeatherData, EarthForecast, SpaceForecast, ChartDataPoint } from '../types';
import { NASA_API_KEY } from '../config';
import { SunIcon, CloudIcon, CloudDrizzleIcon } from '../components/icons';

/**
 * Helper to format a Date object into a YYYY-MM-DD string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const getFormattedDate = (date: Date): string => date.toISOString().split('T')[0];

/**
 * Helper to get the three-letter abbreviation for the day of the week.
 * @param {Date} date - The date to get the day from.
 * @returns {string} The day abbreviation (e.g., "Mon").
 */
const getDayAbbreviation = (date: Date): string => {
    return date.toLocaleString('en-US', { weekday: 'short' });
};

// --- Mock Data Generation ---

/**
 * Generates mock Earth weather data for fallback purposes.
 * @returns {EarthWeatherData} A complete mock Earth weather data object.
 */
const generateMockEarthData = (): EarthWeatherData => {
    const forecast: EarthForecast[] = [];
    for (let i = 1; i <= 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        forecast.push({
            day: getDayAbbreviation(day),
            temperature: Math.round(18 + Math.random() * 5),
            condition: 'Partly Cloudy',
            icon: CloudIcon,
        });
    }
    return {
        location: 'Mock Station',
        temperature: 23,
        windSpeed: 15,
        condition: 'Sunny',
        humidity: 60,
        icon: SunIcon,
        forecast,
        historicalTemp: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: 20 + Math.random() * 5 })),
        historicalWind: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: 12 + Math.random() * 5 })),
        historicalHumidity: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: 55 + Math.random() * 10 })),
    };
};

/**
 * Generates mock Space weather data for fallback purposes.
 * @returns {SpaceWeatherData} A complete mock Space weather data object.
 */
const generateMockSpaceData = (): SpaceWeatherData => {
    const forecast: SpaceForecast[] = [];
    for (let i = 1; i <= 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        forecast.push({
            day: getDayAbbreviation(day),
            solarWindSpeed: Math.round(400 + Math.random() * 100),
            kpIndex: Math.floor(Math.random() * 5),
        });
    }
    return {
        solarWindSpeed: 450,
        kpIndex: 3,
        cmeCount: 2,
        forecast,
        historicalSolarWind: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: 420 + Math.random() * 50 })),
        historicalKpIndex: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: Math.floor(Math.random() * 4) })),
        historicalCmeCount: Array.from({ length: 7 }, (_, i) => ({ time: `Day ${i - 7}`, value: Math.floor(Math.random() * 3) })),
    };
};


// --- NASA Earth Weather (POWER API) ---

/**
 * Fetches and processes Earth weather data from NASA's POWER API.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise<EarthWeatherData>} A promise resolving to the processed Earth weather data.
 */
const fetchNasaEarthData = async (latitude: number, longitude: number): Promise<EarthWeatherData> => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7);

    const formattedStartDate = `${startDate.getFullYear()}${String(startDate.getMonth() + 1).padStart(2, '0')}${String(startDate.getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    const params = 'T2M,WS10M,RH2M'; // Temp, Wind Speed, Humidity
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?start=${formattedStartDate}&end=${formattedEndDate}&latitude=${latitude}&longitude=${longitude}&community=RE&parameters=${params}&format=JSON`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch NASA Earth data.');
    const data = await response.json();

    const properties = data?.properties?.parameter;
    if (!properties || !properties.T2M || !properties.WS10M || !properties.RH2M) {
        throw new Error('Invalid Earth data structure from NASA POWER API.');
    }

    const timeKeys = Object.keys(properties.T2M).sort();
    
    const historicalTemp: ChartDataPoint[] = [];
    const historicalWind: ChartDataPoint[] = [];
    const historicalHumidity: ChartDataPoint[] = [];

    timeKeys.slice(-7).forEach(key => {
        const date = new Date(parseInt(key.substring(0, 4)), parseInt(key.substring(4, 6)) - 1, parseInt(key.substring(6, 8)));
        const dayAbbr = getDayAbbreviation(date);

        const tempVal = properties.T2M[key];
        const windVal = properties.WS10M[key];
        const humidityVal = properties.RH2M[key];

        // NASA POWER API uses -999 for missing data. Replace with null for charting.
        historicalTemp.push({ time: dayAbbr, value: tempVal === -999 ? null : tempVal });
        historicalWind.push({ time: dayAbbr, value: windVal === -999 ? null : windVal });
        historicalHumidity.push({ time: dayAbbr, value: humidityVal === -999 ? null : humidityVal });
    });

    // Find the latest valid (not -999) data point for the main display
    const findLatestValidValue = (paramData: { [key: string]: number }): number | null => {
        const sortedKeys = Object.keys(paramData).sort().reverse();
        for (const key of sortedKeys) {
            if (paramData[key] !== -999) {
                return paramData[key];
            }
        }
        return null;
    };

    const currentTemp = findLatestValidValue(properties.T2M);
    const currentWind = findLatestValidValue(properties.WS10M);
    const currentHumidity = findLatestValidValue(properties.RH2M);
    
    if (currentTemp === null || currentWind === null || currentHumidity === null) {
        throw new Error("Could not find valid recent Earth weather data from NASA.");
    }

    const condition = currentTemp > 25 ? 'Sunny' : (currentTemp < 10 ? 'Cloudy' : 'Partly Cloudy');
    const icon = currentTemp > 25 ? SunIcon : (currentTemp < 10 ? CloudDrizzleIcon : CloudIcon);

    const forecast: EarthForecast[] = [];
    for (let i = 1; i <= 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        const tempVariation = (Math.random() - 0.5) * 4;
        const forecastedTemp = currentTemp + tempVariation;
        forecast.push({
            day: getDayAbbreviation(day),
            temperature: Math.round(forecastedTemp),
            condition: forecastedTemp > 25 ? 'Sunny' : 'Partly Cloudy',
            icon: forecastedTemp > 25 ? SunIcon : CloudIcon,
        });
    }

    return {
        location: data.geometry.coordinates.join(', '),
        temperature: Math.round(currentTemp),
        windSpeed: Math.round(currentWind),
        condition,
        humidity: Math.round(currentHumidity),
        icon,
        forecast,
        historicalTemp,
        historicalWind,
        historicalHumidity,
    };
};

// --- NASA Space Weather (DONKI API) ---
/**
 * Fetches and processes Space weather data from NASA's DONKI API.
 * @returns {Promise<SpaceWeatherData>} A promise resolving to the processed Space weather data.
 */
const fetchNasaSpaceData = async (): Promise<SpaceWeatherData> => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7);
    const formattedStartDate = getFormattedDate(startDate);
    const formattedEndDate = getFormattedDate(today);

    const apiKey = NASA_API_KEY;
    const cmeUrl = `https://api.nasa.gov/DONKI/CME?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=${apiKey}`;
    const gstUrl = `https://api.nasa.gov/DONKI/GST?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=${apiKey}`;

    const [cmeResponse, gstResponse] = await Promise.all([fetch(cmeUrl), fetch(gstUrl)]);
    if (!cmeResponse.ok || !gstResponse.ok) throw new Error('Failed to fetch NASA Space data.');
    const cmeData = await cmeResponse.json();
    const gstData = await gstResponse.json();

    if (!Array.isArray(cmeData) || !Array.isArray(gstData)) {
         throw new Error('Invalid Space data structure from NASA DONKI API.');
    }

    const dailyCmeCounts: { [key: string]: number } = {};
    cmeData.forEach(cme => {
        const date = getFormattedDate(new Date(cme.startTime));
        dailyCmeCounts[date] = (dailyCmeCounts[date] || 0) + 1;
    });

    const dailyMaxKp: { [key: string]: number } = {};
    gstData.forEach(gst => {
        gst.allKpIndex.forEach((kpEntry: { observedTime: string; kpIndex: number }) => {
            const date = getFormattedDate(new Date(kpEntry.observedTime));
            dailyMaxKp[date] = Math.max(dailyMaxKp[date] || 0, kpEntry.kpIndex);
        });
    });

    const historicalCmeCount: ChartDataPoint[] = [];
    const historicalKpIndex: ChartDataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = getFormattedDate(d);
        const dayAbbr = getDayAbbreviation(d);
        historicalCmeCount.push({ time: dayAbbr, value: dailyCmeCounts[dateStr] || 0 });
        historicalKpIndex.push({ time: dayAbbr, value: dailyMaxKp[dateStr] || 0 });
    }

    const latestKp = historicalKpIndex.find(d => d.value !== null)?.value ?? 0;
    const latestSolarWind = 400 + latestKp * 50 + (Math.random() - 0.5) * 50;

    const forecast: SpaceForecast[] = [];
    for (let i = 1; i <= 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);
        const kpVariation = (Math.random() - 0.5) * 2;
        let forecastedKp = Math.round(Math.max(0, latestKp + kpVariation));
        forecast.push({
            day: getDayAbbreviation(day),
            solarWindSpeed: Math.round(400 + forecastedKp * 50 + (Math.random() - 0.5) * 50),
            kpIndex: forecastedKp,
        });
    }

    return {
        solarWindSpeed: Math.round(latestSolarWind),
        kpIndex: latestKp,
        cmeCount: historicalCmeCount.find(d => d.value !== null)?.value ?? 0,
        forecast,
        historicalSolarWind: historicalKpIndex.map(kp => ({ time: kp.time, value: kp.value === null ? null : (400 + kp.value * 50 + (Math.random() - 0.5) * 50) })),
        historicalKpIndex,
        historicalCmeCount,
    };
};

/**
 * Main data fetching function.
 * Fetches both Earth and Space weather data from NASA APIs in parallel.
 * Falls back to mock data if any of the API calls fail.
 * @param {object} params - The coordinates for the weather data.
 * @param {number} params.latitude - The latitude for the Earth weather location.
 * @param {number} params.longitude - The longitude for the Earth weather location.
 * @returns {Promise<WeatherData>} A promise that resolves to the combined weather data.
 */
export const fetchWeatherData = async ({ latitude, longitude }: { latitude: number; longitude: number; }): Promise<WeatherData> => {
    try {
        const [earth, space] = await Promise.all([
            fetchNasaEarthData(latitude, longitude),
            fetchNasaSpaceData()
        ]);
        return { earth, space };
    } catch (error) {
        console.error('Error fetching live weather data:', error instanceof Error ? error.message : String(error));
        console.warn('Falling back to mock data.');
        return {
            earth: generateMockEarthData(),
            space: generateMockSpaceData(),
        };
    }
};