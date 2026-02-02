import React from 'react';

const FitnessGraph = ({ data }) => {
    // data: { timestamp, fitness }[]
    
    if (!data || data.length < 2) {
        return (
            <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center text-gray-500 font-mono text-xs border border-gray-800 mb-4">
                <div className="text-center">
                    <p>Waiting for data...</p>
                    <p className="text-[10px] opacity-50 mt-1">(Need at least 2 points)</p>
                </div>
            </div>
        );
    }

    const fitnessValues = data.map(d => d.fitness);
    const minFit = Math.min(...fitnessValues);
    const maxFit = Math.max(...fitnessValues);
    const range = maxFit - minFit || 1;

    const startTime = data[0].timestamp;
    const endTime = data[data.length - 1].timestamp;
    const timeRange = endTime - startTime || 1;

    const points = data.map((d, i) => {
        const x = ((d.timestamp - startTime) / timeRange) * 100;
        // Normalize fitness to 0-100 (inverted for SVG y-axis)
        // If range is 0 (all fitness same), show straight line in middle (50)
        const normalizedFit = range === 0 ? 0.5 : (d.fitness - minFit) / range;
        const y = 100 - (normalizedFit * 100); 
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="w-full h-48 bg-gray-900 rounded-lg p-4 relative font-mono shadow-md border border-gray-800 mb-4">
            <h3 className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fitness Trajectory</h3>
            
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                 {/* Grid Lines */}
                 <line x1="0" y1="0" x2="100" y2="0" stroke="#1f2937" vectorEffect="non-scaling-stroke" strokeWidth="1" />
                 <line x1="0" y1="25" x2="100" y2="25" stroke="#1f2937" vectorEffect="non-scaling-stroke" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="0" y1="50" x2="100" y2="50" stroke="#1f2937" vectorEffect="non-scaling-stroke" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="0" y1="75" x2="100" y2="75" stroke="#1f2937" vectorEffect="non-scaling-stroke" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="0" y1="100" x2="100" y2="100" stroke="#1f2937" vectorEffect="non-scaling-stroke" strokeWidth="1" />
                 
                 {/* The Line */}
                 <polyline
                    fill="none"
                    stroke="#14b8a6" // teal-500
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                 />
            </svg>
            
             {/* Labels */}
            <div className="absolute top-2 right-2 flex flex-col items-end">
                <span className="text-xs text-teal-400 font-bold">{fitnessValues[fitnessValues.length-1].toFixed(4)}</span>
                <span className="text-[10px] text-gray-500">Current</span>
            </div>
            
             <div className="absolute bottom-2 left-2 text-[10px] text-gray-600">
                Min: {minFit.toFixed(4)}
            </div>
            <div className="absolute top-8 left-2 text-[10px] text-gray-600">
                Max: {maxFit.toFixed(4)}
            </div>
        </div>
    );
};

export default FitnessGraph;
