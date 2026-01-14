// ============================================
// FILE: src/components/medications/MedicationCard.jsx (MEDICAL MODERN)
// ============================================
import { Pill, Clock, Calendar, Edit2, Trash2, FileText, CheckCircle } from 'lucide-react';

const MedicationCard = ({ medication, onEdit, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="glass-card hover:shadow-xl hover:shadow-cyan-100/50 transition-all duration-300 transform group rounded-2xl p-5 border border-white/60">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-3 shadow-lg shadow-cyan-200/50 group-hover:scale-105 transition-transform duration-300">
                        <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-cyan-600 transition-colors">
                            {medication.name}
                        </h3>
                        <p className="text-sm text-cyan-600 font-semibold bg-cyan-50 px-2 py-0.5 rounded-md inline-block mt-1">
                            {medication.dosage}
                        </p>
                    </div>
                </div>
                {medication.active && (
                    <div className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Active</span>
                    </div>
                )}
            </div>

            {/* Times */}
            <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center space-x-2 text-slate-500 mb-3 uppercase tracking-wider text-[10px] font-bold">
                    <Clock className="w-3 h-3" />
                    <span>Schedule</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {medication.times.map((time, index) => (
                        <span
                            key={index}
                            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                        >
                            {time}
                        </span>
                    ))}
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-medium text-slate-500">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                        <Calendar className="w-3 h-3" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-slate-400">Start Date</p>
                        <p className="text-slate-700 font-bold">{formatDate(medication.startDate)}</p>
                    </div>
                </div>
                {medication.endDate && (
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                            <Calendar className="w-3 h-3" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-slate-400">End Date</p>
                            <p className="text-slate-700 font-bold">{formatDate(medication.endDate)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            {medication.instructions && (
                <div className="mb-5 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-900 font-medium leading-relaxed">
                            {medication.instructions}
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-slate-100">
                <button
                    onClick={() => onEdit(medication)}
                    className="flex-1 bg-slate-50 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group/btn border border-transparent hover:border-cyan-100"
                >
                    <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Edit Details</span>
                </button>
                <button
                    onClick={() => onDelete(medication._id)}
                    className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all duration-300 hover:shadow-md"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default MedicationCard;