// ============================================
// FILE: src/components/common/EmptyState.jsx
// ============================================
const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction
}) => {
    return (
        <div className="card text-center py-12 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Icon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="btn-primary inline-flex items-center space-x-2 transform hover:scale-105 transition"
                >
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
};

export default EmptyState;