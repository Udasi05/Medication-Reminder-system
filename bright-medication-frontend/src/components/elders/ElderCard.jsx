// ============================================
// FILE: src/components/elders/ElderCard.jsx (ENHANCED)
// ============================================
import { User, Phone, Globe, Edit2, Trash2, Pill, MapPin } from 'lucide-react';
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
        <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
            {/* Header with gradient */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {elder.name}
                        </h3>
                        {elder.age && (
                            <p className="text-sm text-gray-500">{elder.age} years old</p>
                        )}
                    </div>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Active
                </div>
            </div>

            {/* Details with icons */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3 text-gray-600 group/item hover:text-blue-600 transition-colors">
                    <div className="bg-gray-100 p-2 rounded-lg group-hover/item:bg-blue-50 transition-colors">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{elder.phoneNumber}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-600 group/item hover:text-purple-600 transition-colors">
                    <div className="bg-gray-100 p-2 rounded-lg group-hover/item:bg-purple-50 transition-colors">
                        <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                        {languageFlags[elder.preferredLanguage]} {languageNames[elder.preferredLanguage]}
                    </span>
                </div>

                {elder.address && (
                    <div className="flex items-start space-x-3 text-gray-600 group/item hover:text-green-600 transition-colors">
                        <div className="bg-gray-100 p-2 rounded-lg group-hover/item:bg-green-50 transition-colors">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{elder.address}</span>
                    </div>
                )}
            </div>

            {/* Actions with hover effects */}
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                    onClick={handleViewMedications}
                    className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                >
                    <Pill className="w-4 h-4" />
                    <span>Medications</span>
                </button>
                <button
                    onClick={() => onEdit(elder)}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(elder)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ElderCard;