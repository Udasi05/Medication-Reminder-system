// ============================================
// FILE: src/components/common/PageTransition.jsx
// ============================================
import { useEffect, useState } from 'react';

const PageTransition = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
            {children}
        </div>
    );
};

export default PageTransition;