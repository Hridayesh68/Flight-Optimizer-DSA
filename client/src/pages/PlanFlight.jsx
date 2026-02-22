import React from 'react';
import FlightMap from '../components/Map/FlightMap';
import FlightSearchBox from '../components/Trip/FlightSearchBox';
import FlightMetrics from '../components/Trip/FlightMetrics';

const PlanFlight = () => {
    return (
        <div className="flex flex-col lg:flex-row h-[85vh] bg-gray-50 max-w-7xl mx-auto mt-4 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            {/* Sidebar for controls */}
            <div className="w-full lg:w-1/3 p-6 bg-white overflow-y-auto border-r border-gray-100 relative z-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold border-b pb-2 text-gray-800">Route Builder</h1>
                    <p className="text-sm text-gray-500 mt-2">Find the optimal flight path combining distance, price, and layovers.</p>
                </div>

                <FlightSearchBox />
                <FlightMetrics />
            </div>

            {/* Map Area */}
            <div className="w-full lg:w-2/3 relative min-h-[400px]">
                <div className="h-full w-full shadow-inner">
                    <FlightMap />
                </div>
            </div>
        </div>
    );
};

export default PlanFlight;
