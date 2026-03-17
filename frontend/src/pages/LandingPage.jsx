import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, Sparkles, Map, ShieldCheck, Star, Mail, Lock, User as UserIcon, KeyRound, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'register-admin', 'login-admin', 'otp'

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:5001/api/auth/google', {
                token: credentialResponse.credential
            });
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (error) {
            console.error('Google Sign In Failed', error);
            let backendError = 'Google Sign in failed. Please try again.';
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                backendError = error.response.data?.details || error.response.data?.message || `Server Error: ${error.response.status} ${typeof error.response.data === 'string' ? error.response.data.substring(0, 50) : ''}`;
            } else if (error.request) {
                // The request was made but no response was received (e.g., Network Error, CORS)
                backendError = `Network Error: Could not connect to the backend server. Is it running on port 5000? Details: ${error.message}`;
            } else {
                // Something happened in setting up the request that triggered an Error
                backendError = `Request Error: ${error.message}`;
            }
            
            setError(`Google Error: ${backendError}`);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            setAuthMode('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            if (err.response?.data?.message === 'Please verify your email first') {
                setTimeout(() => setAuthMode('register'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            setAuthMode('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5001/api/auth/register-admin', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            setAuthMode('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/verify-otp', {
                email: formData.email,
                otp: formData.otp
            });
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    const renderAuthForm = () => {
        if (authMode === 'otp') {
            return (
                <motion.form
                    key="otp"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleVerifyOTP}
                    className="space-y-5 w-full"
                >
                    <div className="relative group">
                        <KeyRound className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            name="otp"
                            placeholder="6-digit Code"
                            value={formData.otp}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-mono tracking-[0.5em] text-center text-lg"
                            maxLength="6"
                        />
                    </div>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-xl text-center">
                            {error}
                        </motion.div>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl py-4 transition-all shadow-lg shadow-blue-500/25 flex justify-center items-center gap-2 group"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                        {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </motion.button>
                    <p className="text-sm text-center text-slate-400 mt-4">
                        Code sent to <span className="font-medium text-slate-200">{formData.email}</span>
                    </p>
                    <button
                        type="button"
                        onClick={() => { setAuthMode('login'); setError(''); }}
                        className="w-full text-slate-500 hover:text-slate-300 text-sm mt-2 transition-colors"
                    >
                        Go back
                    </button>
                </motion.form>
            );
        }

        return (
            <motion.div
                key="main-auth"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
            >
                <form onSubmit={(authMode === 'login' || authMode === 'login-admin') ? handleLogin : (authMode === 'register-admin' ? handleAdminRegister : handleRegister)} className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {(authMode === 'register' || authMode === 'register-admin') && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative group overflow-hidden"
                            >
                                <UserIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm px-4 py-3 rounded-xl text-center">
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white font-semibold rounded-2xl py-4 mt-2 transition-all shadow-lg flex justify-center items-center gap-2 group ${(authMode === 'register-admin' || authMode === 'login-admin') ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-orange-500/25' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'}`}
                    >
                        {loading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : authMode === 'login-admin' ? 'Partner Login' : authMode === 'register-admin' ? 'Join as Partner' : 'Create Account')}
                        {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </motion.button>
                </form>

                <div className="relative flex items-center py-6">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">or continue with</span>
                    <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="flex justify-center w-full">
                    <div className="hover:scale-105 transition-transform duration-300">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            theme="filled_black"
                            size="large"
                            shape="circle"
                            text="continue_with"
                        />
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    {(authMode === 'login' || authMode === 'login-admin') ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            if (authMode === 'login-admin' || authMode === 'register-admin') {
                                setAuthMode(authMode === 'login-admin' ? 'register-admin' : 'login-admin');
                            } else {
                                setAuthMode(authMode === 'login' ? 'register' : 'login');
                            }
                            setError('');
                        }}
                        className="text-white hover:text-blue-400 font-semibold transition-colors"
                    >
                        {(authMode === 'login' || authMode === 'login-admin') ? 'Create one' : 'Sign In'}
                    </button>
                    {(authMode === 'login' || authMode === 'register') && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                            <span className="text-slate-500 block">Property Manager? </span>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setAuthMode('login-admin');
                                        setError('');
                                    }}
                                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                                >
                                    Login
                                </button>
                                <span className="text-slate-600">|</span>
                                <button
                                    onClick={() => {
                                        setAuthMode('register-admin');
                                        setError('');
                                    }}
                                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                                >
                                    Partner with us
                                </button>
                            </div>
                        </div>
                    )}
                    {(authMode === 'login-admin' || authMode === 'register-admin') && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                            <button
                                onClick={() => {
                                    setAuthMode('login');
                                    setError('');
                                }}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Not a Property Manager? Return to User Login
                            </button>
                        </div>
                    )}
                </p>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#030712] flex relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&w=2560&q=80"
                    alt="Luxury Indian Resort"
                    className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/50"></div>
            </div>

            {/* Animated Ambient Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"
            />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between min-h-screen py-12">

                {/* Left side text content and Floating Images */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:w-1/2 flex flex-col justify-center mb-16 lg:mb-0 relative"
                >

                    <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 w-fit mb-8 shadow-2xl relative z-10">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        <span className="text-slate-300 text-sm font-medium tracking-widest uppercase">The Standard of Luxury</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                        LuxeStays<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                            Reimagined.
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-400 mb-12 max-w-lg font-light leading-relaxed">
                        Curated selections of the world's most extraordinary properties. Sign in to unlock exclusive rates and real-time availability.
                    </motion.p>

                    {/* Features list */}
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 mb-10 hidden lg:flex">
                        {[
                            { icon: Map, title: "Global Portfolio", color: "blue" },
                            { icon: ShieldCheck, title: "Secure Booking", color: "indigo" },
                            { icon: Star, title: "Elite Privileges", color: "purple" }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center text-slate-300 gap-3">
                                <div className={`bg-${feature.color}-500/20 p-2.5 rounded-xl border border-${feature.color}-500/20 shadow-inner`}>
                                    <feature.icon className={`h-5 w-5 text-${feature.color}-400`} />
                                </div>
                                <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{feature.title}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Static Showcase Layout */}
                    <motion.div variants={itemVariants} className="hidden lg:flex gap-4 items-stretch h-48 w-full max-w-2xl">
                        <div className="flex-1 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10 shadow-xl bg-slate-800">
                            <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Rajasthan Palace" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-semibold text-sm">Taj Lake Palace, Udaipur</p>
                                <p className="text-slate-400 text-xs mt-0.5">Starting at ₹6,000/nt</p>
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10 shadow-xl bg-slate-800">
                            <img src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Kerala Backwaters" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-semibold text-sm">Kumarakom Resort, Kerala</p>
                                <p className="text-slate-400 text-xs mt-0.5">Starting at ₹5,000/nt</p>
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/10 shadow-xl bg-slate-800">
                            <img src="https://images.unsplash.com/photo-1564507592208-0177dfd24f0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Taj Mumbai" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-semibold text-sm">Taj Mahal Palace, Mumbai</p>
                                <p className="text-slate-400 text-xs mt-0.5">Starting at ₹4,000/nt</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right side login card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                    className="lg:w-[480px] w-full"
                >
                    <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

                        <div className="text-center mb-8 relative z-10">
                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                                className="flex justify-center mb-6"
                            >
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl shadow-blue-500/20 border border-white/20">
                                    <Hotel className="h-8 w-8 text-white" />
                                </div>
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                {authMode === 'login' ? 'Welcome Back' : authMode === 'login-admin' ? 'Partner Dashboard Login' : authMode === 'register-admin' ? 'Partner With Us' : authMode === 'register' ? 'Create Account' : 'Security Check'}
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
                                {(authMode === 'login' || authMode === 'login-admin') ? 'Enter your credentials to continue.' : authMode === 'register-admin' ? 'List your properties and manage bookings.' : authMode === 'register' ? 'Join our exclusive community.' : 'Please verify your identity.'}
                            </p>
                        </div>

                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                {renderAuthForm()}
                            </AnimatePresence>
                        </div>

                        <p className="text-xs text-slate-500 text-center mt-8 relative z-10">
                            By continuing, you agree to LuxeStays' <button className="text-slate-300 hover:text-white transition-colors">Terms of Service</button> and <button className="text-slate-300 hover:text-white transition-colors">Privacy Policy</button>.
                        </p>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
