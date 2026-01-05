// ============================================
// FILE: src/components/common/LoadingSpinner.jsx
// ============================================
const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className={`${sizeClasses[size]} relative`}>
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            {text && <p className="mt-4 text-gray-600 animate-pulse">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;