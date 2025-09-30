import React, { useState } from 'react';

/**
 * Props for the MetricDisplay component.
 */
interface MetricDisplayProps {
    /** The icon component to display next to the label. */
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    /** The text label for the metric. */
    label: string;
    /** The value of the metric. */
    value: string | number;
    /** The tooltip text to show on hover. */
    tooltip: string;
}

/**
 * A component that displays a single weather metric with an icon, label, value,
 * and an educational tooltip that appears on hover.
 * @param {MetricDisplayProps} props - The component props.
 * @returns {React.ReactElement} The rendered metric display row.
 */
const MetricDisplay: React.FC<MetricDisplayProps> = ({ icon: Icon, label, value, tooltip }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative flex items-center justify-between p-3 bg-white/5 rounded-lg transition-colors hover:bg-white/10"
             onMouseEnter={() => setShowTooltip(true)}
             onMouseLeave={() => setShowTooltip(false)}>
            <div className="flex items-center">
                <Icon className="w-6 h-6 mr-3 text-gray-300" />
                <span className="text-lg text-gray-300">{label}</span>
            </div>
            <span className="text-xl font-semibold font-orbitron">{value}</span>
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-[#0D0D0D] border border-gray-600 text-white text-sm rounded-lg shadow-lg z-20">
                    <h4 className="font-bold mb-1">Did You Know?</h4>
                    {tooltip}
                </div>
            )}
        </div>
    );
};

export default MetricDisplay;
