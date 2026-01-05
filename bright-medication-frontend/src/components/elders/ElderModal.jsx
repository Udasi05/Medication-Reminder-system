// ============================================
// FILE: src/components/elders/ElderModal.jsx
// ============================================
import { useState, useEffect } from 'react';
import { elderAPI } from '../../services/api';
import { X, User, Phone, Globe, MapPin, AlertCircle } from 'lucide-react';

const ElderModal = ({ elder, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        preferredLanguage: 'hi',
        age: '',
        address: '',
        emergencyContact: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (elder) {
            setFormData({
                name: elder.name || '',
                phoneNumber: elder.phoneNumber || '',
                preferredLanguage: elder.preferredLanguage || 'hi',
                age: elder.age || '',
                address: elder.address || '',
                emergencyContact: elder.emergencyContact || ''
            });
        }
    }, [elder]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Remove empty fields
            const submitData = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== '')
            );

            if (elder) {
                await elderAPI.update(elder._id, submitData);
            } else {
                await elderAPI.create(submitData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save elder');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {elder ? 'Edit Elder' : 'Add New Elder'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field pl-11"
                                placeholder="Enter elder's name"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="input-field pl-11"
                                placeholder="9876543210"
                                pattern="[6-9][0-9]{9}"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">10-digit Indian phone number</p>
                    </div>

                    {/* Preferred Language */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Language <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                name="preferredLanguage"
                                value={formData.preferredLanguage}
                                onChange={handleChange}
                                className="input-field pl-11"
                                required
                            >
                                <option value="hi">Hindi (हिंदी)</option>
                                <option value="en">English</option>
                                <option value="mr">Marathi (मराठी)</option>
                            </select>
                        </div>
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age
                        </label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="75"
                            min="0"
                            max="150"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field pl-11"
                                placeholder="Enter address"
                                rows="2"
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Contact
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="tel"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="input-field pl-11"
                                placeholder="9123456789"
                                pattern="[6-9][0-9]{9}"
                            />
                        </div>
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
                            {loading ? 'Saving...' : elder ? 'Update Elder' : 'Add Elder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ElderModal;