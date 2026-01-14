// ============================================
// FILE: src/components/layout/Sidebar.jsx (MEDICAL MODERN)
// ============================================
import { NavLink } from 'react-router-dom';
import { Home, Users, Pill, Bell, BarChart3, LogOut, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Overview' },
        { path: '/dashboard/elders', icon: Users, label: 'Elders' },
        { path: '/dashboard/medications', icon: Pill, label: 'Medications' },
        { path: '/dashboard/reminders', icon: Bell, label: 'Reminders' },
        { path: '/dashboard/stats', icon: BarChart3, label: 'Statistics' },
    ];

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 h-screen fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Logo Section */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3.5">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-teal-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl"></div>
                        <div className="relative w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                            Bright<span className="text-teal-600">Med</span>
                        </h1>
                        <p className="text-[10px] font-bold text-cyan-600 tracking-wider bg-cyan-50/80 px-2 py-0.5 rounded-full w-fit mt-0.5 border border-cyan-100">
                            CLINIC
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    Main Menu
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                `relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden font-medium
                                ${isActive
                                    ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm border border-teal-100/50'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full my-2"></div>
                                    )}
                                    <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-teal-600 fill-teal-600/10' : 'group-hover:scale-110'}`} />
                                    <span className={isActive ? 'font-bold' : ''}>{item.label}</span>

                                    {/* Active Indicator & Hover Icons */}
                                    {isActive ? (
                                        <ChevronRight className="w-4 h-4 ml-auto text-teal-400" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-400" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 m-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50/80 rounded-2xl transition-all duration-300 group border border-transparent hover:border-red-100"
                >
                    <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="font-semibold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;