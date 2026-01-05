// ============================================
// FILE: src/pages/dashboard/Home.jsx (ENHANCED)
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { elderAPI, reminderAPI } from '../../services/api';
import { Users, Pill, Bell, TrendingUp, Plus, ArrowRight, Calendar, CheckCircle } from 'lucide-react';

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
            color: 'blue',
            path: '/dashboard/elders',
            description: 'Register a new elder'
        },
        {
            icon: Pill,
            label: 'Add Medication',
            color: 'purple',
            path: '/dashboard/medications',
            description: 'Schedule medications'
        },
        {
            icon: Bell,
            label: 'View Reminders',
            color: 'green',
            path: '/dashboard/reminders',
            description: 'Check today\'s reminders'
        }
    ];

    const statCards = [
        {
            label: 'Total Elders',
            value: stats.totalElders,
            icon: Users,
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: "Today's Reminders",
            value: stats.todayReminders,
            icon: Bell,
            color: 'purple',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            label: 'Adherence Rate',
            value: stats.adherenceRate,
            icon: TrendingUp,
            color: 'green',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        }
    ];

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'taken': return 'green';
            case 'missed': return 'red';
            default: return 'orange';
        }
    };

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                    Here's an overview of your medication management system
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                                    <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                                    <Icon className={`w-8 h-8 ${stat.textColor}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="card mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Plus className="w-6 h-6 mr-2 text-blue-600" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(action.path)}
                                className={`bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 hover:from-${action.color}-100 hover:to-${action.color}-200 border border-${action.color}-200 p-6 rounded-xl transition-all group`}
                            >
                                <Icon className={`w-8 h-8 text-${action.color}-600 mb-3`} />
                                <h3 className="font-bold text-gray-800 mb-1">{action.label}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                                <ArrowRight className={`w-5 h-5 text-${action.color}-600 mt-2 group-hover:translate-x-1 transition-transform`} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Recent Reminders */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                        Recent Reminders
                    </h2>
                    <button
                        onClick={() => navigate('/dashboard/reminders')}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : recentReminders.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reminders Yet</h3>
                        <p className="text-gray-600 mb-4">
                            Add elders and medications to start receiving reminders
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/elders')}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Your First Elder</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReminders.map((reminder) => (
                            <div
                                key={reminder._id}
                                className={`p-4 rounded-lg border-l-4 border-${getStatusColor(reminder.status)}-500 bg-gray-50 hover:bg-gray-100 transition`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className={`w-5 h-5 text-${getStatusColor(reminder.status)}-500`} />
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {reminder.elderId?.name} - {reminder.medicationId?.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatTime(reminder.scheduledTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(reminder.status)}-100 text-${getStatusColor(reminder.status)}-700`}>
                                        {reminder.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;