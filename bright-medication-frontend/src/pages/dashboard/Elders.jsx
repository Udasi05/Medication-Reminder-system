// ============================================
// FILE: src/pages/dashboard/Elders.jsx (ENHANCED)
// ============================================
import { useState, useEffect } from 'react';
import { elderAPI } from '../../services/api';
import ElderCard from '../../components/elders/ElderCard';
import ElderModal from '../../components/elders/ElderModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SkeletonCard from '../../components/common/SkeletonCard';
import PageTransition from '../../components/common/PageTransition';
import { Plus, Users, AlertCircle } from 'lucide-react';

const Elders = () => {
    const [elders, setElders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingElder, setEditingElder] = useState(null);
    const [toast, setToast] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, elder: null });

    useEffect(() => {
        fetchElders();
    }, []);

    const fetchElders = async () => {
        try {
            setLoading(true);
            const response = await elderAPI.getAll();
            setElders(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch elders');
            showToast('error', 'Failed to load elders');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ type, message });
    };

    const handleAddElder = () => {
        setEditingElder(null);
        setIsModalOpen(true);
    };

    const handleEditElder = (elder) => {
        setEditingElder(elder);
        setIsModalOpen(true);
    };

    const handleDeleteElder = (elder) => {
        setDeleteDialog({ isOpen: true, elder });
    };

    const confirmDelete = async () => {
        try {
            await elderAPI.delete(deleteDialog.elder._id);
            setElders(elders.filter(e => e._id !== deleteDialog.elder._id));
            showToast('success', 'Elder deleted successfully');
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Failed to delete elder');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingElder(null);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingElder(null);
        fetchElders();
        showToast('success', editingElder ? 'Elder updated successfully' : 'Elder added successfully');
    };

    return (
        <PageTransition>
            <div>
                {/* Header with animation */}
                <div className="flex items-center justify-between mb-8 animate-slide-in-bottom">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Elder Management</h1>
                        <p className="text-gray-600 mt-2">Manage elders and their medication schedules</p>
                    </div>
                    <button
                        onClick={handleAddElder}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Elder</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-fade-in">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : elders.length === 0 ? (
                    /* Empty State */
                    <EmptyState
                        icon={Users}
                        title="No Elders Yet"
                        description="Start by adding your first elder to manage their medications"
                        actionLabel="Add First Elder"
                        onAction={handleAddElder}
                    />
                ) : (
                    /* Elder Grid with stagger animation */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {elders.map((elder, index) => (
                            <div
                                key={elder._id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ElderCard
                                    elder={elder}
                                    onEdit={handleEditElder}
                                    onDelete={handleDeleteElder}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <ElderModal
                        elder={editingElder}
                        onClose={handleModalClose}
                        onSuccess={handleModalSuccess}
                    />
                )}

                {/* Confirm Delete Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={() => setDeleteDialog({ isOpen: false, elder: null })}
                    onConfirm={confirmDelete}
                    title="Delete Elder"
                    message={`Are you sure you want to delete ${deleteDialog.elder?.name}? This will also delete all medications for this elder.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    danger
                />

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </PageTransition>
    );
};

export default Elders;
