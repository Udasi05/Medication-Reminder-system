// ============================================
// FILE: src/pages/dashboard/Reminders.jsx
// ============================================
import { useState, useEffect } from 'react';
import { reminderAPI } from '../../services/api';
import ReminderCard from '../../components/reminders/ReminderCard';
import { Bell, Loader, AlertCircle, Calendar, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const Reminders = () => {
    const [todayReminders, setTodayReminders] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        taken: 0,
        missed: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, taken, missed, pending

    useEffect(() => {
        fetchTodayReminders();
        // Refresh every 30 seconds
        const interval = setInterval(fetchTodayReminders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchTodayReminders = async () => {
        try {
            setLoading(true);
            const response = await reminderAPI.getToday();
            setTodayReminders(response.data.data);
            setSummary(response.data.summary);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reminders');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (reminderId) => {
        try {
            await reminderAPI.confirm(reminderId);
            await fetchTodayReminders(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to confirm reminder');
        }
    };

    const filteredReminders = todayReminders.filter(reminder => {
        if (filter === 'all') return true;
        return reminder.status === filter;
    });

    const getFilterCount = (status) => {
        if (status === 'all') return summary.total;
        return summary[status] || 0;
    };

    if (loading && todayReminders.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Loading reminders...</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Today's Reminders</h1>
                </div>
                <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">Total Reminders</p>
                            <p className="text-3xl font-bold text-blue-900">{summary.total}</p>
                        </div>
                        <Bell className="w-10 h-10 text-blue-500" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Taken</p>
                            <p className="text-3xl font-bold text-green-900">{summary.taken}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium mb-1">Missed</p>
                            <p className="text-3xl font-bold text-red-900">{summary.missed}</p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-600 font-medium mb-1">Pending</p>
                            <p className="text-3xl font-bold text-orange-900">{summary.pending}</p>
                        </div>
                        <Clock className="w-10 h-10 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex items-center space-x-2 overflow-x-auto">
                    {[
                        { value: 'all', label: 'All', color: 'blue' },
                        { value: 'taken', label: 'Taken', color: 'green' },
                        { value: 'missed', label: 'Missed', color: 'red' },
                        { value: 'sent', label: 'Pending', color: 'orange' }
                    ].map((filterOption) => (
                        <button
                            key={filterOption.value}
                            onClick={() => setFilter(filterOption.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${filter === filterOption.value
                                    ? `bg-${filterOption.color}-500 text-white`
                                    : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                                }`}
                        >
                            {filterOption.label} ({getFilterCount(filterOption.value)})
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredReminders.length === 0 && !loading && (
                <div className="card text-center py-12">
                    <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {filter === 'all' ? 'No Reminders Today' : `No ${filter} reminders`}
                    </h3>
                    <p className="text-gray-600">
                        {summary.total === 0
                            ? 'Add medications to elders to start receiving reminders'
                            : 'Try changing the filter to see other reminders'
                        }
                    </p>
                </div>
            )}

            {/* Reminders List */}
            {filteredReminders.length > 0 && (
                <div className="space-y-4">
                    {filteredReminders.map((reminder) => (
                        <ReminderCard
                            key={reminder._id}
                            reminder={reminder}
                            onConfirm={handleConfirm}
                        />
                    ))}
                </div>
            )}

            {/* Auto-refresh indicator */}
            {!loading && todayReminders.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Auto-refreshing every 30 seconds
                </div>
            )}
        </div>
    );
};

export default Reminders;