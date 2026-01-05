// ============================================
// FILE: src/pages/dashboard/Medications.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { medicationAPI, elderAPI } from '../../services/api';
import MedicationCard from '../../components/medications/MedicationCard';
import MedicationModal from '../../components/medications/MedicationModal';
import { Plus, Pill, AlertCircle, Loader, ArrowLeft } from 'lucide-react';

const Medications = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const elderIdParam = searchParams.get('elder');

    const [medications, setMedications] = useState([]);
    const [elders, setElders] = useState([]);
    const [selectedElder, setSelectedElder] = useState(elderIdParam || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState(null);

    useEffect(() => {
        fetchElders();
    }, []);

    useEffect(() => {
        if (selectedElder) {
            fetchMedications(selectedElder);
        } else {
            setMedications([]);
            setLoading(false);
        }
    }, [selectedElder]);

    const fetchElders = async () => {
        try {
            const response = await elderAPI.getAll();
            setElders(response.data.data);
            if (elderIdParam && response.data.data.length > 0) {
                setSelectedElder(elderIdParam);
            }
        } catch (err) {
            setError('Failed to fetch elders');
        }
    };

    const fetchMedications = async (elderId) => {
        try {
            setLoading(true);
            const response = await medicationAPI.getByElder(elderId);
            setMedications(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch medications');
            setMedications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleElderChange = (e) => {
        const elderId = e.target.value;
        setSelectedElder(elderId);
        if (elderId) {
            setSearchParams({ elder: elderId });
        } else {
            setSearchParams({});
        }
    };

    const handleAddMedication = () => {
        if (!selectedElder) {
            alert('Please select an elder first');
            return;
        }
        setEditingMedication(null);
        setIsModalOpen(true);
    };

    const handleEditMedication = (medication) => {
        setEditingMedication(medication);
        setIsModalOpen(true);
    };

    const handleDeleteMedication = async (medicationId) => {
        if (!window.confirm('Are you sure you want to delete this medication?')) {
            return;
        }

        try {
            await medicationAPI.delete(medicationId);
            setMedications(medications.filter(m => m._id !== medicationId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete medication');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingMedication(null);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingMedication(null);
        if (selectedElder) {
            fetchMedications(selectedElder);
        }
    };

    const selectedElderData = elders.find(e => e._id === selectedElder);

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Medication Management</h1>
                    <p className="text-gray-600 mt-2">Schedule and manage medications for elders</p>
                </div>
                <button
                    onClick={handleAddMedication}
                    className="btn-primary flex items-center space-x-2"
                    disabled={!selectedElder}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Medication</span>
                </button>
            </div>

            {/* Elder Selection */}
            <div className="card mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Elder
                </label>
                <select
                    value={selectedElder}
                    onChange={handleElderChange}
                    className="input-field"
                >
                    <option value="">-- Choose an elder --</option>
                    {elders.map((elder) => (
                        <option key={elder._id} value={elder._id}>
                            {elder.name} ({elder.phoneNumber})
                        </option>
                    ))}
                </select>

                {selectedElderData && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-blue-900">{selectedElderData.name}</p>
                                <p className="text-sm text-blue-700">
                                    {selectedElderData.phoneNumber} • Language: {selectedElderData.preferredLanguage.toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedElder('')}
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Change</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Loading medications...</span>
                </div>
            )}

            {/* No Elder Selected */}
            {!selectedElder && !loading && (
                <div className="card text-center py-12">
                    <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Select an Elder</h3>
                    <p className="text-gray-600">
                        Choose an elder from the dropdown above to view their medications
                    </p>
                </div>
            )}

            {/* Empty State */}
            {selectedElder && !loading && medications.length === 0 && (
                <div className="card text-center py-12">
                    <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Medications Yet</h3>
                    <p className="text-gray-600 mb-6">
                        Add medications for {selectedElderData?.name}
                    </p>
                    <button onClick={handleAddMedication} className="btn-primary inline-flex items-center space-x-2">
                        <Plus className="w-5 h-5" />
                        <span>Add First Medication</span>
                    </button>
                </div>
            )}

            {/* Medication Grid */}
            {selectedElder && !loading && medications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medications.map((medication) => (
                        <MedicationCard
                            key={medication._id}
                            medication={medication}
                            onEdit={handleEditMedication}
                            onDelete={handleDeleteMedication}
                        />
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <MedicationModal
                    medication={editingMedication}
                    elderId={selectedElder}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
};

export default Medications;