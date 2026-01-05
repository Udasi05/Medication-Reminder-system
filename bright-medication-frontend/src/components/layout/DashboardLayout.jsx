// ============================================
// FILE: src/components/layout/DashboardLayout.jsx
// ============================================
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 min-h-screen bg-gray-50">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;