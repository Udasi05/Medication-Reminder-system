// ============================================
// FILE: src/components/medications/MedicationModal.jsx
// ============================================
import { useState, useEffect } from 'react';
import { medicationAPI } from '../../services/api';
import { X, Pill, Clock, Calendar, FileText, AlertCircle, Plus, Trash2 } from 'lucide-react';

const MedicationModal = ({ medication, elderId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        times: ['08:00'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        instructions: '',
        active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (medication) {
            setFormData({
                name: medication.name || '',
                dosage: medication.dosage || '',
                times: medication.times || ['08:00'],
                startDate: medication.startDate ? new Date(medication.startDate).toISOString().split('T')[0] : '',
                endDate: medication.endDate ? new Date(medication.endDate).toISOString().split('T')[0] : '',
                instructions: medication.instructions || '',
                active: medication.active !== undefined ? medication.active : true
            });
        }
    }, [medication]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleTimeChange = (index, value) => {
        const newTimes = [...formData.times];
        newTimes[index] = value;
        setFormData({ ...formData, times: newTimes });
    };

    const addTimeSlot = () => {
        setFormData({ ...formData, times: [...formData.times, '12:00'] });
    };

    const removeTimeSlot = (index) => {
        if (formData.times.length > 1) {
            const newTimes = formData.times.filter((_, i) => i !== index);
            setFormData({ ...formData, times: newTimes });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submitData = {
                ...formData,
                elderId,
            };

            // Remove empty fields
            if (!submitData.endDate) delete submitData.endDate;
            if (!submitData.instructions) delete submitData.instructions;

            if (medication) {
                await medicationAPI.update(medication._id, submitData);
            } else {
                await medicationAPI.create(submitData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save medication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {medication ? 'Edit Medication' : 'Add New Medication'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Name & Dosage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Medication Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medication Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field pl-11"
                                    placeholder="e.g., Aspirin"
                                    required
                                />
                            </div>
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dosage <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., 75mg, 1 tablet"
                                required
                            />
                        </div>
                    </div>

                    {/* Medication Times */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medication Times <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3">
                            {formData.times.map((time, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-1 relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => handleTimeChange(index, e.target.value)}
                                            className="input-field pl-11"
                                            required
                                        />
                                    </div>
                                    {formData.times.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTimeSlot(index)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addTimeSlot}
                            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Another Time</span>
                        </button>
                    </div>

                    {/* Start & End Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="input-field pl-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date (Optional)
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="input-field pl-11"
                                    min={formData.startDate}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instructions
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                className="input-field pl-11"
                                placeholder="e.g., Take after meals, with water"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Active (Reminders will be sent)
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : medication ? 'Update Medication' : 'Add Medication'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicationModal;