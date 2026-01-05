// ============================================
// FILE: src/pages/auth/Login.jsx (ENHANCED)
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Loader, Sparkles } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <>
            {/* DARK OVERLAY */}
            <div className="fixed inset-0 bg-black/50 z-10" />

            {/* CENTERED CONTENT */}
            <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
                <div className="max-w-md w-full">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/80 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            Sign in to Bright Medication Reminder
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="animate-spin w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                {loading ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        <p className="text-center text-gray-600 mt-6">
                            Don’t have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;