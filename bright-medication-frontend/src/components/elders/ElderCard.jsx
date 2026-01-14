// ============================================
// FILE: src/components/elders/ElderCard.jsx (MEDICAL MODERN)
// ============================================
import { User, Phone, Globe, Edit2, Trash2, Pill, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ElderCard = ({ elder, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const languageNames = {
        en: 'English',
        hi: 'Hindi',
        mr: 'Marathi'
    };

    const languageFlags = {
        en: '🇬🇧',
        hi: '🇮🇳',
        mr: '🇮🇳'
    };

    const handleViewMedications = () => {
        navigate(`/dashboard/medications?elder=${elder._id}`);
    };

    return (
        <div className="glass-card hover:shadow-xl hover:shadow-cyan-100/50 transition-all duration-300 transform group rounded-2xl p-5 border border-white/60">
            {/* Header with gradient */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl p-3.5 shadow-lg shadow-teal-200/50 group-hover:scale-105 transition-transform duration-300">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                            {elder.name}
                        </h3>
                        {elder.age && (
                            <p className="text-sm text-slate-500 font-medium">{elder.age} years old</p>
                        )}
                    </div>
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Active
                </div>
            </div>

            {/* Details with icons */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-slate-600 group/item hover:text-teal-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-teal-50 transition-colors">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{elder.phoneNumber}</span>
                </div>

                <div className="flex items-center space-x-3 text-slate-600 group/item hover:text-indigo-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-indigo-50 transition-colors">
                        <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                        {languageFlags[elder.preferredLanguage]} {languageNames[elder.preferredLanguage]}
                    </span>
                </div>

                {elder.address && (
                    <div className="flex items-start space-x-3 text-slate-600 group/item hover:text-cyan-600 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-cyan-50 transition-colors">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium line-clamp-1">{elder.address}</span>
                    </div>
                )}
            </div>

            {/* Actions with hover effects */}
            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                    onClick={handleViewMedications}
                    className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                >
                    <Pill className="w-4 h-4" />
                    <span>Meds</span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onEdit(elder)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                        title="Edit Elder"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(elder)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                        title="Delete Elder"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElderCard;