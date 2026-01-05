// ============================================
// FILE: src/components/common/ConfirmDialog.jsx
// ============================================
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {danger && (
                                <div className="bg-red-100 rounded-full p-2">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t flex space-x-3">
                    <button onClick={onClose} className="flex-1 btn-secondary">
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 ${danger ? 'bg-red-600 hover:bg-red-700' : 'btn-primary'} text-white font-semibold px-6 py-3 rounded-lg transition`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;