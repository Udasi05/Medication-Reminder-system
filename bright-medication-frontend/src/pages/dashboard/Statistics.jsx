// ============================================
// FILE: src/pages/dashboard/Statistics.jsx (MEDICAL MODERN)
// ============================================
import { useState, useEffect } from 'react';
import { reminderAPI, elderAPI } from '../../services/api';
import { BarChart3, TrendingUp, Award, Calendar, Loader, AlertCircle, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';

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
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-500 font-medium">Loading statistics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel p-8 text-center rounded-3xl animate-fade-in-up">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-700 font-medium">{error}</p>
                <button
                    onClick={fetchData}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const adherenceRate = stats ? parseFloat(stats.adherenceRate) : 0;
    const getAdherenceConfig = (rate) => {
        if (rate >= 90) return { color: 'emerald', label: 'Excellent', gradient: 'from-emerald-500 to-teal-500' };
        if (rate >= 70) return { color: 'amber', label: 'Good', gradient: 'from-amber-400 to-orange-500' };
        return { color: 'red', label: 'Needs Attention', gradient: 'from-red-500 to-rose-600' };
    };

    const adherenceConfig = getAdherenceConfig(adherenceRate);
    const adherenceColor = adherenceConfig.color;

    return (
        <PageTransition>
            <div className="space-y-8 pb-10">
                {/* Header with Glass Effect */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <BarChart3 className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Statistics & Performance</h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Track medication adherence and health metrics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {/* Adherence Rate Card */}
                    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/60">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${adherenceColor}-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Adherence Rate</h3>
                            <Award className={`w-6 h-6 text-${adherenceColor}-500`} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-extrabold bg-gradient-to-br ${adherenceConfig.gradient} bg-clip-text text-transparent`}>
                                    {stats?.adherenceRate || '0%'}
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs font-semibold mt-2 uppercase tracking-wide">
                                {stats?.period || 'Last 7 days'}
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className={`text-${adherenceColor}-600`}>{adherenceConfig.label}</span>
                                <span className="text-slate-400">Target: 90%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`bg-gradient-to-r ${adherenceConfig.gradient} h-full rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: stats?.adherenceRate || '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Total Reminders Card */}
                    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/60">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Reminders</h3>
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold text-blue-600">
                                    {stats?.totalReminders || 0}
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs font-semibold mt-2 uppercase tracking-wide">
                                {stats?.period || 'Last 7 days'}
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100">
                                <div className="text-lg font-bold text-emerald-600">{stats?.takenReminders || 0}</div>
                                <div className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-wider">Taken</div>
                            </div>
                            <div className="bg-red-50 rounded-xl p-2.5 text-center border border-red-100">
                                <div className="text-lg font-bold text-red-600">{stats?.missedReminders || 0}</div>
                                <div className="text-[10px] font-bold text-red-700/60 uppercase tracking-wider">Missed</div>
                            </div>
                        </div>
                    </div>

                    {/* Active Elders Card */}
                    <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/60">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Elders</h3>
                            <Users className="w-6 h-6 text-teal-600" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold text-teal-600">
                                    {elders.length}
                                </span>
                            </div>
                            <p className="text-slate-400 text-xs font-semibold mt-2 uppercase tracking-wide">
                                Currently Managed
                            </p>
                        </div>

                        <div className="mt-6 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Meds/Week</span>
                            <span className="text-lg font-bold text-slate-800">
                                {stats?.totalReminders ? Math.ceil(stats.totalReminders / 7) : 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Split: Detailed Stats & Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>

                    {/* Detailed Breakdown */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            Status Breakdown
                        </h2>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Total Reminders</p>
                                        <p className="text-xs text-slate-400 font-medium">Scheduled doses</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-slate-800">{stats?.totalReminders || 0}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Successfully Taken</p>
                                        <p className="text-xs text-slate-400 font-medium">Confirmed doses</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-emerald-600">{stats?.takenReminders || 0}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 border border-red-100 hover:border-red-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Missed Doses</p>
                                        <p className="text-xs text-slate-400 font-medium">Requires follow-up</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-red-600">{stats?.missedReminders || 0}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-100 hover:border-amber-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Pending Status</p>
                                        <p className="text-xs text-slate-400 font-medium">Awaiting action</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-amber-600">{stats?.pendingReminders || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Elder Overview List */}
                    <div className="glass-panel p-8 rounded-3xl">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-teal-500" />
                            Elder Overview
                        </h2>

                        {elders.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No elders added yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                {elders.map((elder) => (
                                    <div
                                        key={elder._id}
                                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-200/50">
                                                {elder.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm">{elder.name}</h3>
                                                <p className="text-xs text-slate-500 font-medium">{elder.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                                {elder.preferredLanguage}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Statistics;