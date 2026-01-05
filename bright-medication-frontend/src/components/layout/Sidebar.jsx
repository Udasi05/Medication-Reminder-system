// ============================================
// FILE: src/components/layout/Sidebar.jsx
// ============================================
import { NavLink } from 'react-router-dom';
import { Home, Users, Pill, Bell, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/dashboard/elders', icon: Users, label: 'Elders' },
        { path: '/dashboard/medications', icon: Pill, label: 'Medications' },
        { path: '/dashboard/reminders', icon: Bell, label: 'Reminders' },
        { path: '/dashboard/stats', icon: BarChart3, label: 'Statistics' },
    ];

    return (
        <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Bright Med
                </h1>
                <p className="text-xs text-gray-500 mt-1">Medication Reminder</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;