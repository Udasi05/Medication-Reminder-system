// ============================================
// FILE: src/pages/auth/Register.jsx (MEDICAL MODERN)
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, Phone, Loader, ShieldCheck, Stethoscope } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
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

        const result = await register(formData);

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
            <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-cyan-600 to-teal-700 relative overflow-hidden items-center justify-center p-12">
                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float-gentle" />
                    <div className="absolute top-20 right-20 w-64 h-64 bg-teal-300 rounded-full mix-blend-overlay filter blur-3xl animate-float-gentle" style={{ animationDelay: '3s' }} />
                </div>

                <div className="relative z-10 text-white max-w-lg text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl animate-float-gentle">
                            <Stethoscope className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight tracking-tight">Join our Community</h2>
                    <p className="text-lg text-teal-100 leading-relaxed font-medium">
                        Start your journey towards better health management. Secure, reliable, and designed for you.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
                <div className="max-w-md w-full animate-fade-in-up py-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex lg:hidden w-16 h-16 bg-teal-600 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 font-medium">Fill in your information to get started</p>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-fade-in-up">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2.5">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-modern pl-12 bg-slate-50/50"
                                        placeholder="Dr. John Doe"
                                        required
                                    />
                                </div>
                            </div>

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
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2.5">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="input-modern pl-12 bg-slate-50/50"
                                        placeholder="9876543210"
                                        pattern="[0-9]{10}"
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
                                        minLength="6"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-2 ml-1 font-medium">Must be at least 6 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <Loader className="animate-spin w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition-all">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;