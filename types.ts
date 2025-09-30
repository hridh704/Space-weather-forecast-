import type React from 'react';

/**
 * Represents a single day's forecast for Earth weather.
 */
export interface EarthForecast {
  day: string;
  temperature: number;
  condition: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

/**
 * Represents the complete Earth weather data object.
 */
export interface EarthWeatherData {
  location: string;
  temperature: number;
  windSpeed: number;
  condition: string;
  humidity: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  forecast: EarthForecast[];
  historicalTemp: ChartDataPoint[];
  historicalWind: ChartDataPoint[];
  historicalHumidity: ChartDataPoint[];
}

/**
 * Represents a single day's forecast for Space weather.
 */
export interface SpaceForecast {
  day: string;
  solarWindSpeed: number;
  kpIndex: number;
}

/**
 * Represents the complete Space weather data object.
 */
export interface SpaceWeatherData {
  solarWindSpeed: number;
  kpIndex: number;
  cmeCount: number;
  forecast: SpaceForecast[];
  historicalSolarWind: ChartDataPoint[];
  historicalKpIndex: ChartDataPoint[];
  historicalCmeCount: ChartDataPoint[];
}

/**
 * A composite object containing both Earth and Space weather data.
 */
export interface WeatherData {
  earth: EarthWeatherData;
  space: SpaceWeatherData;
}

/**
 * Represents a single data point for use in charts.
 * The value can be null to represent gaps in data.
 */
export interface ChartDataPoint {
  time: string;
  value: number | null;
}
