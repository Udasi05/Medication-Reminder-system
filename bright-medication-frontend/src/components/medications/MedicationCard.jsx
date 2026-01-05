// ============================================
// FILE: src/components/medications/MedicationCard.jsx
// ============================================
import { Pill, Clock, Calendar, Edit2, Trash2, FileText } from 'lucide-react';

const MedicationCard = ({ medication, onEdit, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="card hover:shadow-xl transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-full p-3">
                        <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{medication.name}</h3>
                        <p className="text-sm text-gray-500">{medication.dosage}</p>
                    </div>
                </div>
                {medication.active && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                        Active
                    </span>
                )}
            </div>

            {/* Times */}
            <div className="mb-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Schedule</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {medication.times.map((time, index) => (
                        <span
                            key={index}
                            className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
                        >
                            {time}
                        </span>
                    ))}
                </div>
            </div>

            {/* Dates */}
            <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {formatDate(medication.startDate)}</span>
                </div>
                {medication.endDate && (
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>End: {formatDate(medication.endDate)}</span>
                    </div>
                )}
            </div>

            {/* Instructions */}
            {medication.instructions && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{medication.instructions}</p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                    onClick={() => onEdit(medication)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition flex items-center justify-center space-x-2"
                >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                </button>
                <button
                    onClick={() => onDelete(medication._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default MedicationCard;