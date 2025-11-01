import { useState } from 'react';

export default function MetricsCard({ icon, label, value, unit = '', tooltip = '', growthPercent = null }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="flex items-center justify-between text-green-600 mb-2">
                <div className="flex items-center">
                    <div className="text-xl">{icon}</div>
                    <p className="ml-2 text-sm font-semibold text-gray-600">{label}</p>
                </div>
            </div>

            {showTooltip && tooltip && (
                <div className="absolute z-10 top-full left-0 mt-2 bg-gray-900 text-white text-xs rounded p-3 w-64 shadow-lg">
                    {tooltip}
                    <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
            )}

            <hr className="my-2"/>

            <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">
                    {unit && <span className="text-gray-500">{unit}</span>}
                    {value}
                </p>

                {/* ✅ ADDED: Growth indicator */}
                {growthPercent !== null && !isNaN(growthPercent) && (
                    <span className={`hidden md:block text-sm font-bold ${growthPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growthPercent >= 0 ? '📈' : '📉'} {Math.abs(growthPercent).toFixed(1)}%
                    </span>
                )}
            </div>
        </div>
    );
}
