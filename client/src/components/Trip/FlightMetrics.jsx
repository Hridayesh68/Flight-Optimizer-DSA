import React, { useContext, useState } from 'react';
import { TripContext } from '../../context/TripContext';
import { AuthContext } from '../../context/AuthContext';
import { IoTimeOutline, IoFootstepsOutline, IoSpeedometerOutline, IoCashOutline, IoAnalyticsOutline, IoBookmarkOutline } from 'react-icons/io5';
import tripService from '../../services/tripService';
const TypeNames = {
    bfs: 'BFS (Min Layovers)',
    dfs: 'DFS (Any Route)',
    dijkstra: "Dijkstra's Algorithm",
    astar: 'A* Heuristic'
};

const TypeColors = {
    bfs: 'bg-orange-100 text-orange-700',
    dfs: 'bg-gray-100 text-gray-700',
    dijkstra: 'bg-blue-100 text-blue-700',
    astar: 'bg-green-100 text-green-700'
};

const SingleMetric = ({ metric, routeObj, onSave }) => {
    const { distance, time, cost, nodes, executionTimeMs, type, layovers } = metric;
    const routeNodeObjects = routeObj ? routeObj.path : [];

    const [saving, setSaving] = useState(false);

    const handleSaveClick = async () => {
        setSaving(true);
        await onSave(metric, routeObj);
        setSaving(false);
    };

    return (
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex flex-col space-y-4 mt-6">
            <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-gray-800 text-lg">Route Analysis</h3>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleSaveClick}
                        disabled={saving || metric.isSaved}
                        className="flex items-center space-x-1 px-3 py-1 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-semibold transition-colors disabled:opacity-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-500"
                    >
                        <IoBookmarkOutline />
                        <span>{metric.isSaved ? 'Saved' : saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${TypeColors[type] || 'bg-blue-100 text-blue-700'}`}>
                        {TypeNames[type] || type}
                    </span>
                </div>
            </div>

            {/* Flight Path String */}
            <div className="bg-gray-50 rounded-lg p-4 mb-2">
                <div className="text-xs text-gray-500 font-bold uppercase mb-2 tracking-wider">Flight Sequence</div>
                <div className="flex flex-wrap items-center text-lg font-semibold text-gray-800 gap-2">
                    {routeNodeObjects.map((apt, index) => (
                        <React.Fragment key={`seq-${apt.code}-${index}`}>
                            <span>{apt.code}</span>
                            {index < routeNodeObjects.length - 1 && (
                                <span className="text-gray-400">→</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/50 p-4 rounded-xl flex items-center space-x-3 border border-blue-50">
                    <IoCashOutline className="text-2xl text-emerald-600" />
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Total Cost</div>
                        <div className="font-bold text-gray-900 text-lg">${cost}</div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl flex items-center space-x-3 border border-blue-50">
                    <IoTimeOutline className="text-2xl text-amber-500" />
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Duration</div>
                        <div className="font-bold text-gray-900 text-lg">
                            {Math.floor(time / 60)}h {time % 60}m
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl flex items-center space-x-3 border border-blue-50">
                    <IoSpeedometerOutline className="text-2xl text-blue-500" />
                    <div>
                        <div className="text-xs text-gray-500 font-medium">Distance</div>
                        <div className="font-bold text-gray-900 text-lg">{distance.toLocaleString()} km</div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl flex flex-col justify-center border border-blue-50">
                    <div className="text-xs text-gray-500 font-medium">Layovers</div>
                    <div className="font-bold text-gray-900 text-lg">{layovers} Stop(s)</div>
                </div>
            </div>

            {/* Algorithm Performance Footer */}
            <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                    <IoTimeOutline className="text-gray-400" />
                    <span>Computed in <b>{executionTimeMs}ms</b></span>
                </div>
                <div className="flex items-center space-x-1">
                    <IoFootstepsOutline className="text-gray-400" />
                    <span><b>{nodes}</b> nodes explored</span>
                </div>
            </div>
        </div>
    );
};

const ComparisonTable = ({ metricsArray, visualizedRoute, onSave }) => {
    // Find highlights (best results across metrics)
    const bestLayovers = Math.min(...metricsArray.map(m => m.layovers));
    const bestDistance = Math.min(...metricsArray.map(m => m.distance));
    const bestTime = Math.min(...metricsArray.map(m => m.time));
    const bestCost = Math.min(...metricsArray.map(m => m.cost));
    const bestExecution = Math.min(...metricsArray.map(m => m.executionTimeMs));

    const checkHighlight = (val, bestVal) => val === bestVal ? 'font-bold text-green-600 bg-green-50 rounded px-1' : '';

    const [savingIdx, setSavingIdx] = useState(null);

    const handleSaveClick = async (metric, routeObj, idx) => {
        setSavingIdx(idx);
        await onSave(metric, routeObj);
        setSavingIdx(null);
    };

    return (
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex flex-col space-y-4 mt-6 overflow-x-auto">
            <div className="flex items-center space-x-2 border-b pb-3">
                <IoAnalyticsOutline className="text-2xl text-blue-600" />
                <h3 className="font-bold text-gray-800 text-lg">Algorithm Comparison</h3>
            </div>

            <table className="w-full text-left text-sm text-gray-700 border-collapse">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                        <th className="px-3 py-3 border-b border-gray-200">Algorithm</th>
                        <th className="px-3 py-3 border-b border-gray-200">Stops</th>
                        <th className="px-3 py-3 border-b border-gray-200">Distance</th>
                        <th className="px-3 py-3 border-b border-gray-200">Cost</th>
                        <th className="px-3 py-3 border-b border-gray-200">Nodes Visited</th>
                        <th className="px-3 py-3 border-b border-gray-200">Exec Time</th>
                        <th className="px-3 py-3 border-b border-gray-200 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {metricsArray.map((m, idx) => (
                        <tr key={`comp-${m.type}-${idx}`} className="hover:bg-gray-50/50">
                            <td className="px-3 py-3">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded ${TypeColors[m.type] || 'bg-blue-100 text-blue-700'}`}>
                                    {TypeNames[m.type] || m.type}
                                </span>
                            </td>
                            <td className={`px-3 py-3 ${checkHighlight(m.layovers, bestLayovers)}`}>{m.layovers}</td>
                            <td className={`px-3 py-3 ${checkHighlight(m.distance, bestDistance)}`}>{m.distance.toLocaleString()} km</td>
                            <td className={`px-3 py-3 ${checkHighlight(m.cost, bestCost)}`}>${m.cost}</td>
                            <td className="px-3 py-3">{m.nodes}</td>
                            <td className={`px-3 py-3 ${checkHighlight(m.executionTimeMs, bestExecution)}`}>{m.executionTimeMs}ms</td>
                            <td className="px-3 py-3 text-right">
                                <button
                                    onClick={() => handleSaveClick(m, visualizedRoute.find(r => r.type === m.type), idx)}
                                    disabled={savingIdx === idx || m.isSaved}
                                    className={`p-1.5 rounded disabled:opacity-50 ${m.isSaved ? 'text-gray-400 bg-gray-100' : 'text-blue-600 hover:bg-blue-100'}`}
                                    title={m.isSaved ? "Saved" : "Save this route"}
                                >
                                    <IoBookmarkOutline className="text-lg" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const FlightMetrics = () => {
    const { algorithmMetrics, visualizedRoute } = useContext(TripContext);
    const { user } = useContext(AuthContext);

    // Keep track of which specific metric.types have been saved in this session
    const [savedTypes, setSavedTypes] = useState(new Set());
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg, isError = false) => {
        setToastMessage({ text: msg, isError });
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleSave = async (metric, routeObj) => {
        if (!user) {
            showToast('Please log in to save flights.', true);
            return;
        }

        const pathNodes = routeObj?.path || [];
        if (pathNodes.length < 2) return;

        const origin = {
            code: pathNodes[0].code,
            city: pathNodes[0].city,
            name: pathNodes[0].name
        };
        const destination = {
            code: pathNodes[pathNodes.length - 1].code,
            city: pathNodes[pathNodes.length - 1].city,
            name: pathNodes[pathNodes.length - 1].name
        };

        const tripData = {
            origin,
            destination,
            algorithm: metric.type,
            optimizedBy: 'cost', // default or arbitrary context value
            metrics: {
                distance: metric.distance,
                time: metric.time,
                cost: metric.cost,
                executionTimeMs: metric.executionTimeMs,
                layovers: metric.layovers
            },
            path: pathNodes
        };

        try {
            await tripService.saveTrip(tripData);
            setSavedTypes(prev => new Set(prev).add(metric.type));
            showToast('Flight route saved successfully!');
        } catch (err) {
            console.error('Failed to save route:', err);
            if (err.response && err.response.status === 409) {
                setSavedTypes(prev => new Set(prev).add(metric.type));
                showToast('This exact route and algorithm combination is already saved.', true);
            } else {
                showToast('Failed to save route. Missing auth token or server error.', true);
            }
        }
    };

    if (!algorithmMetrics || !visualizedRoute || algorithmMetrics.length === 0) return null;

    // Inject isSaved runtime state so child components disable correctly
    const metricsWithSaveState = algorithmMetrics.map(m => ({
        ...m,
        isSaved: savedTypes.has(m.type)
    }));

    return (
        <div className="relative">
            {/* Simple Toast Overlay */}
            {toastMessage && (
                <div className={`fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-2xl font-bold text-sm transform transition-all duration-300 ${toastMessage.isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {toastMessage.text}
                </div>
            )}

            {metricsWithSaveState.length === 1 ? (
                <SingleMetric metric={metricsWithSaveState[0]} routeObj={visualizedRoute[0]} onSave={handleSave} />
            ) : (
                <ComparisonTable metricsArray={metricsWithSaveState} visualizedRoute={visualizedRoute} onSave={handleSave} />
            )}
        </div>
    );
};

export default FlightMetrics;
