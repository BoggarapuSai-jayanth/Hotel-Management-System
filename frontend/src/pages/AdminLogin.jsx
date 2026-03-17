import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock } from 'lucide-react';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', credentials);
            if (res.data.message === 'OTP sent to email') {
                setShowOtp(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/verify-otp', {
                email: credentials.email,
                otp
            });

            if (res.data.role === 'admin') {
                localStorage.setItem('user', JSON.stringify(res.data));
                localStorage.setItem('token', res.data.token);
                // Dispatch event so Navbar can update if needed (or simply navigate)
                window.dispatchEvent(new Event('storage'));
                navigate('/admin');
            } else {
                setError('Access denied. Admin privileges required.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="text-center mb-8">
                    <Shield className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                    <h2 className="text-3xl font-extrabold text-white">Admin Portal</h2>
                    <p className="mt-2 text-sm text-slate-400">Secure access for designated administrators only.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm flex items-center">
                        {error}
                    </div>
                )}

                {!showOtp ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="admin@luxestays.com"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg flex items-center justify-center"
                        >
                            <Lock className="w-5 h-5 mr-2" /> Authenticate
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Enter Verification Code</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center tracking-widest text-lg font-mono"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
                        >
                            Verify & Enter Dashboard
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
