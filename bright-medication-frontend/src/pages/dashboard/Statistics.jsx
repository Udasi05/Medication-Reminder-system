// ============================================
// FILE: src/pages/dashboard/Statistics.jsx
// ============================================
import { useState, useEffect } from 'react';
import { reminderAPI, elderAPI } from '../../services/api';
import { BarChart3, TrendingUp, Award, Calendar, Loader, AlertCircle } from 'lucide-react';

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [elders, setElders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsResponse, eldersResponse] = await Promise.all([
                reminderAPI.getStats(),
                elderAPI.getAll()
            ]);
            setStats(statsResponse.data.data);
            setElders(eldersResponse.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Loading statistics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card p-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-center text-red-700">{error}</p>
            </div>
        );
    }

    const adherenceRate = stats ? parseFloat(stats.adherenceRate) : 0;
    const getAdherenceColor = (rate) => {
        if (rate >= 90) return 'green';
        if (rate >= 70) return 'yellow';
        return 'red';
    };

    const adherenceColor = getAdherenceColor(adherenceRate);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Statistics & Adherence</h1>
                </div>
                <p className="text-gray-600">Track medication adherence and overall performance</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Adherence Rate */}
                <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-purple-900">Adherence Rate</h3>
                        <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-center">
                        <div className={`text-5xl font-bold text-${adherenceColor}-600 mb-2`}>
                            {stats?.adherenceRate || '0%'}
                        </div>
                        <p className="text-sm text-purple-700">{stats?.period || 'Last 7 days'}</p>
                    </div>
                    <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-purple-700">Target:</span>
                            <span className="font-semibold text-purple-900">90%</span>
                        </div>
                    </div>
                </div>

                {/* Total Reminders */}
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-900">Total Reminders</h3>
                        <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold text-blue-600 mb-2">
                            {stats?.totalReminders || 0}
                        </div>
                        <p className="text-sm text-blue-700">{stats?.period || 'Last 7 days'}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="bg-white bg-opacity-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-green-600">{stats?.takenReminders || 0}</div>
                            <div className="text-xs text-blue-700">Taken</div>
                        </div>
                        <div className="bg-white bg-opacity-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-red-600">{stats?.missedReminders || 0}</div>
                            <div className="text-xs text-blue-700">Missed</div>
                        </div>
                    </div>
                </div>

                {/* Active Elders */}
                <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-green-900">Active Elders</h3>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold text-green-600 mb-2">
                            {elders.length}
                        </div>
                        <p className="text-sm text-green-700">Currently managed</p>
                    </div>
                    <div className="mt-4 bg-white bg-opacity-50 rounded-lg p-3">
                        <div className="text-center text-sm text-green-700">
                            Total medications tracked
                        </div>
                        <div className="text-center text-2xl font-bold text-green-900 mt-1">
                            {stats?.totalReminders ? Math.ceil(stats.totalReminders / 7) : 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                            {stats?.totalReminders || 0}
                        </div>
                        <p className="text-gray-600">Total Reminders</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            {stats?.takenReminders || 0}
                        </div>
                        <p className="text-gray-600">Successfully Taken</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-red-600 mb-2">
                            {stats?.missedReminders || 0}
                        </div>
                        <p className="text-gray-600">Missed Doses</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-2">
                            {stats?.pendingReminders || 0}
                        </div>
                        <p className="text-gray-600">Pending</p>
                    </div>
                </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Adherence Progress</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Current Rate</span>
                            <span className="font-semibold text-gray-800">{stats?.adherenceRate || '0%'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6">
                            <div
                                className={`bg-gradient-to-r from-${adherenceColor}-400 to-${adherenceColor}-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{ width: stats?.adherenceRate || '0%' }}
                            >
                                <span className="text-white text-xs font-bold">{stats?.adherenceRate || '0%'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Target Line */}
                    <div className="relative pt-4">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span className="text-green-600 font-bold">90% Target</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elder List with Stats */}
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Elder Overview</h2>
                {elders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No elders added yet. Add elders to see their statistics.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {elders.map((elder) => (
                            <div
                                key={elder._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
                                        {elder.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{elder.name}</h3>
                                        <p className="text-sm text-gray-600">{elder.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Language</div>
                                    <div className="font-semibold text-gray-800">{elder.preferredLanguage.toUpperCase()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className={`card border-l-4 border-${adherenceColor}-500`}>
                    <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
                    <p className={`text-2xl font-bold text-${adherenceColor}-600`}>
                        {adherenceRate >= 90 ? 'Excellent' : adherenceRate >= 70 ? 'Good' : 'Needs Attention'}
                    </p>
                </div>
                <div className="card border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Consistency</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {stats?.takenReminders || 0}/{stats?.totalReminders || 0}
                    </p>
                </div>
                <div className="card border-l-4 border-purple-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Period</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats?.period || 'Last 7 days'}</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;