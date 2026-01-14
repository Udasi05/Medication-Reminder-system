// ============================================
// FILE: src/pages/dashboard/Home.jsx (MEDICAL MODERN)
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { elderAPI, reminderAPI } from '../../services/api';
import { Users, Pill, Bell, TrendingUp, Plus, ArrowRight, Calendar, CheckCircle, Clock } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalElders: 0,
        todayReminders: 0,
        adherenceRate: '0%'
    });
    const [recentReminders, setRecentReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [eldersResponse, todayResponse, statsResponse] = await Promise.all([
                elderAPI.getAll().catch(() => ({ data: { data: [] } })),
                reminderAPI.getToday().catch(() => ({ data: { data: [], summary: {} } })),
                reminderAPI.getStats().catch(() => ({ data: { data: { adherenceRate: '0%' } } }))
            ]);

            setStats({
                totalElders: eldersResponse.data.data.length,
                todayReminders: todayResponse.data.summary?.total || 0,
                adherenceRate: statsResponse.data.data?.adherenceRate || '0%'
            });

            setRecentReminders(todayResponse.data.data.slice(0, 5));
        } catch (err) {
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            icon: Users,
            label: 'Add Elder',
            color: 'teal',
            path: '/dashboard/elders',
            description: 'Register a new elder'
        },
        {
            icon: Pill,
            label: 'Add Medication',
            color: 'cyan',
            path: '/dashboard/medications',
            description: 'Schedule medications'
        },
        {
            icon: Bell,
            label: 'View Reminders',
            color: 'indigo',
            path: '/dashboard/reminders',
            description: 'Check today\'s reminders'
        }
    ];

    const statCards = [
        {
            label: 'Total Elders',
            value: stats.totalElders,
            icon: Users,
            color: 'teal',
            bgColor: 'bg-teal-50',
            textColor: 'text-teal-600',
            gradient: 'from-teal-500 to-emerald-500'
        },
        {
            label: "Today's Reminders",
            value: stats.todayReminders,
            icon: Bell,
            color: 'cyan',
            bgColor: 'bg-cyan-50',
            textColor: 'text-cyan-600',
            gradient: 'from-cyan-500 to-blue-500'
        },
        {
            label: 'Adherence Rate',
            value: stats.adherenceRate,
            icon: TrendingUp,
            color: 'indigo',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600',
            gradient: 'from-indigo-500 to-purple-500'
        }
    ];

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'taken': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' };
            case 'missed': return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
            default: return { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' };
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section with Glass Effect */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 p-8 shadow-xl text-white animate-fade-in-up">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, Dr. {user?.name?.split(' ')[0] || 'User'}! 👋
                    </h1>
                    <p className="text-teal-50 text-lg font-medium opacity-90 max-w-2xl">
                        Here's your daily overview. You have <span className="font-bold text-white">{stats.todayReminders} reminders</span> scheduled for today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-cyan-100/50 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1 font-bold uppercase tracking-wider">{stat.label}</p>
                                    <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-gray-200`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="glass-panel rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mr-3">
                        <Plus className="w-5 h-5 text-teal-600" />
                    </div>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(action.path)}
                                className={`relative overflow-hidden bg-white/50 border border-slate-200 hover:border-${action.color}-300 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-md text-left`}
                            >
                                <div className={`w-10 h-10 rounded-full bg-${action.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-5 h-5 text-${action.color}-600`} />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">{action.label}</h3>
                                <p className="text-xs text-slate-500 font-medium">{action.description}</p>
                                <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0`}>
                                    <ArrowRight className={`w-5 h-5 text-${action.color}-500`} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Recent Reminders */}
            <div className="glass-panel rounded-3xl p-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                            <Clock className="w-5 h-5 text-indigo-600" />
                        </div>
                        Recent Reminders
                    </h2>
                    <button
                        onClick={() => navigate('/dashboard/reminders')}
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-xl font-bold text-sm flex items-center transition-colors"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : recentReminders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Reminders Yet</h3>
                        <p className="text-slate-500 mb-6 font-medium max-w-sm mx-auto">
                            Add elders and medications to start receiving reminders and tracking health.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/elders')}
                            className="btn-primary shadow-lg shadow-teal-500/30"
                        >
                            <span className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Your First Elder
                            </span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReminders.map((reminder, idx) => {
                            const styles = getStatusStyles(reminder.status);
                            return (
                                <div
                                    key={reminder._id}
                                    className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-300"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.bg}`}>
                                            <CheckCircle className={`w-5 h-5 ${styles.icon}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                {reminder.medicationId?.name || 'Unknown Med'}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                For: <span className="text-teal-600 font-bold">{reminder.elderId?.name || 'Unknown'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded-md mb-1 inline-block">
                                            {formatTime(reminder.scheduledTime)}
                                        </p>
                                        <div>
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${styles.bg} ${styles.text}`}>
                                                {reminder.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;