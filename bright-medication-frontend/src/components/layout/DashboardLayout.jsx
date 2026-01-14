// ============================================
// FILE: src/components/layout/DashboardLayout.jsx (MEDICAL MODERN)
// ============================================
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, User } from 'lucide-react';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-medical-gradient relative font-sans text-slate-800">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-72 p-8 transition-all duration-300">
                {/* Refined Glass Header */}
                <header className="flex justify-between items-center mb-10 sticky top-8 z-20 glass-panel rounded-2xl px-6 py-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Dashboard
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">Welcome back, Dr. John</p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search patients, meds..."
                                className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 w-72 shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-sm font-medium"
                            />
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

                        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-all relative hover:-translate-y-0.5 active:translate-y-0">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                                    <User className="w-5 h-5 text-teal-600" />
                                </div>
                            </div>
                            <div className="hidden md:block leading-tight">
                                <p className="text-sm font-bold text-slate-700">Dr. John Doe</p>
                                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wide">Cardiologist</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="animate-fade-in-up">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;