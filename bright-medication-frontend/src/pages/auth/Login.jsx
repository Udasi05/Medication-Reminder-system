// ============================================
// FILE: src/pages/auth/Login.jsx (MEDICAL MODERN)
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Loader, HeartPulse, Activity } from 'lucide-react';

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
        <div className="min-h-screen flex w-full bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
            {/* LEFT SIDE - VISUAL */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 relative overflow-hidden items-center justify-center p-12">
                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-20 left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float-gentle" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-overlay filter blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 text-white max-w-lg text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl animate-float-gentle">
                            <HeartPulse className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight tracking-tight">Your Health, simplified.</h2>
                    <p className="text-lg text-cyan-100 leading-relaxed font-medium">
                        Manage your medications, track adherence, and care for your loved ones with our intelligent reminder system.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                <div className="max-w-md w-full animate-fade-in-up">
                    <div className="text-center mb-10">
                        <div className="inline-flex lg:hidden w-16 h-16 bg-teal-600 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
                            <HeartPulse className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-fade-in-up">
                                <Activity className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2.5">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-modern pl-12 bg-slate-50/50"
                                        placeholder="doctor@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2.5">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-modern pl-12 bg-slate-50/50"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader className="animate-spin w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600 font-medium">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-400 font-medium">
                        &copy; 2026 Bright Medication. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;