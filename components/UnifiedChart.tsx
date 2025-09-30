import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, Line, RadialBarChart, PolarAngleAxis, RadialBar } from 'recharts';
import type { EarthWeatherData, SpaceWeatherData } from '../types';

/**
 * Props for the UnifiedChart component.
 */
interface UnifiedChartProps {
    earthData: EarthWeatherData;
    spaceData: SpaceWeatherData;
}

type ChartView = 'temp_vs_solar' | 'wind_vs_solar' | 'geomagnetic' | 'kp_forecast';

/**
 * A custom tooltip component for Recharts to match the app's style.
 * It also handles un-scaling the Earth Wind value for display.
 * @param {object} props - The props injected by Recharts.
 * @param {boolean} props.active - Whether the tooltip is active.
 * @param {Array} props.payload - The data payload for the tooltip.
 * @param {string} props.label - The label for the current data point.
 * @returns {React.ReactElement | null} The rendered tooltip or null.
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-black/70 backdrop-blur-sm border border-gray-600 rounded-md text-white">
        <p className="label">{`Time: ${label}`}</p>
        {payload.map((p: any, index: number) => {
            let value = p.value;
            // If this is a scaled value, divide by 10 for display.
            if (p.dataKey === 'Earth Wind (x10)' || p.dataKey === 'Temperature (x10)') {
                if (value !== null && value !== undefined) {
                    value = value / 10;
                }
            }
            return (
                <p key={index} style={{ color: p.color || p.stroke }}>
                    {`${p.name}: ${value !== null && value !== undefined ? Math.round(value) : 'N/A'}`}
                </p>
            );
        })}
      </div>
    );
  }
  return null;
};

/**
 * A component that displays multiple, switchable charts for visualizing weather data.
 * @param {UnifiedChartProps} props - The component props.
 * @returns {React.ReactElement} The rendered data visualizer section.
 */
const UnifiedChart: React.FC<UnifiedChartProps> = ({ earthData, spaceData }) => {
    const [activeTab, setActiveTab] = useState<ChartView>('temp_vs_solar');
    
    const combinedTempSolarData = earthData.historicalTemp.map((tempPoint, index) => ({
        time: tempPoint.time,
        'Temperature (x10)': tempPoint.value !== null ? tempPoint.value * 10 : null,
        'Solar Wind': spaceData.historicalSolarWind[index]?.value,
    }));

    const combinedWindSolarData = earthData.historicalWind.map((windPoint, index) => ({
        time: windPoint.time,
        'Earth Wind (x10)': windPoint.value !== null ? windPoint.value * 10 : null,
        'Solar Wind': spaceData.historicalSolarWind[index]?.value,
    }));
    
    const allGeomagneticTimes = [...new Set([...spaceData.historicalCmeCount.map(d => d.time), ...spaceData.historicalKpIndex.map(d => d.time)])].sort();
    const geomagneticData = allGeomagneticTimes.map(time => ({
        time: time,
        'CME Count': spaceData.historicalCmeCount.find(d => d.time === time)?.value ?? 0,
        'Max Kp-Index': spaceData.historicalKpIndex.find(d => d.time === time)?.value ?? 0,
    }));

    /**
     * Renders the currently active chart based on the `activeTab` state.
     * @returns {React.ReactElement | null} The chart component to render.
     */
    const renderChart = () => {
        switch (activeTab) {
            case 'temp_vs_solar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={combinedTempSolarData}>
                            <defs>
                                <linearGradient id="colorTempBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8}/><stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis 
                                yAxisId="left" 
                                orientation="left" 
                                stroke="#3b82f6" 
                                allowDecimals={false}
                                tickFormatter={(value) => `${Math.round(value / 10)}`}
                            />
                            <YAxis yAxisId="right" orientation="right" stroke="#FF6B00" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area 
                                yAxisId="left" 
                                type="monotone" 
                                dataKey="Temperature (x10)" 
                                name="Temperature"
                                stroke="#3b82f6" 
                                fillOpacity={1} 
                                fill="url(#colorTempBlue)" 
                                connectNulls={false} 
                            />
                            <Area 
                                yAxisId="right" 
                                type="monotone" 
                                dataKey="Solar Wind" 
                                stroke="#FF6B00" 
                                fillOpacity={1} 
                                fill="url(#colorSolar)" 
                                connectNulls={false} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'wind_vs_solar':
                 return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={combinedWindSolarData}>
                            <defs>
                                <linearGradient id="colorEarthWind" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                <linearGradient id="colorSolarWind" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8}/><stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis 
                                yAxisId="left" 
                                orientation="left" 
                                stroke="#3b82f6" 
                                allowDecimals={false}
                                tickFormatter={(value) => `${Math.round(value / 10)}`}
                             />
                            <YAxis yAxisId="right" orientation="right" stroke="#FF6B00" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area 
                                yAxisId="left" 
                                type="monotone" 
                                dataKey="Earth Wind (x10)" 
                                name="Earth Wind" 
                                stroke="#3b82f6" 
                                fill="url(#colorEarthWind)" 
                                connectNulls={false} 
                            />
                            <Area yAxisId="right" type="monotone" dataKey="Solar Wind" stroke="#FF6B00" fill="url(#colorSolarWind)" connectNulls={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'kp_forecast': {
                const peakForecast = spaceData.forecast.reduce(
                    (max, day) => (day.kpIndex > max.kpIndex ? day : max),
                    spaceData.forecast[0] || { kpIndex: 0, day: 'N/A' }
                );
                const peakKp = peakForecast.kpIndex;
                const gaugeData = [{ name: 'Kp-Index', value: peakKp }];

                const getKpColor = (kp: number) => {
                    if (kp <= 3) return '#33FFD1'; // Calm - Teal
                    if (kp <= 4) return '#eab308'; // Unsettled - Yellow
                    if (kp <= 6) return '#FF6B00'; // Storm - Orange
                    return '#ef4444'; // Severe Storm - Red
                };
                const color = getKpColor(peakKp);
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="90%"
                            barSize={30}
                            data={gaugeData}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <PolarAngleAxis type="number" domain={[0, 9]} angleAxisId={0} tick={false} />
                            <RadialBar
                                background
                                dataKey="value"
                                angleAxisId={0}
                                fill={color}
                                cornerRadius={15}
                                className="transition-all"
                            />
                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="font-orbitron text-5xl fill-white">
                                {peakKp.toFixed(0)}
                            </text>
                            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-lg fill-gray-400">
                                Peak Kp-Index
                            </text>
                             <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">
                                (Forecast for {peakForecast.day})
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                )
            }
            case 'geomagnetic':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={geomagneticData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="time" stroke="#EAEAEA" />
                            <YAxis yAxisId="left" orientation="left" stroke="#eab308" domain={[0, dataMax => (dataMax < 5 ? 5 : dataMax + 1)]} allowDecimals={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#FF6B00" domain={[0, 9]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="CME Count" barSize={20} fill="#eab308" />
                            <Line yAxisId="right" type="monotone" dataKey="Max Kp-Index" stroke="#FF6B00" strokeWidth={2} connectNulls={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };
    
    /**
     * A button component for switching between chart tabs.
     * @param {object} props - The component props.
     * @param {ChartView} props.view - The chart view this button activates.
     * @param {string} props.label - The text label for the button.
     */
    const TabButton = ({ view, label }: { view: ChartView; label: string }) => (
        <button
            onClick={() => setActiveTab(view)}
            className={`px-3 py-2 text-sm sm:px-4 sm:text-base rounded-md transition-colors font-semibold ${activeTab === view ? 'bg-[#FF6B00] text-black' : 'bg-white/10 hover:bg-white/20'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold font-orbitron mb-4 text-center">Data Visualizer</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                <TabButton view="temp_vs_solar" label="🌡️ Temp vs Solar" />
                <TabButton view="wind_vs_solar" label="🌬️ Wind vs Solar" />
                <TabButton view="geomagnetic" label="🌩️ Geomagnetic" />
                <TabButton view="kp_forecast" label="⚡ Kp Forecast" />
            </div>
            <div className="w-full h-[300px]">
                {renderChart()}
            </div>
        </div>
    );
};

export default UnifiedChart;