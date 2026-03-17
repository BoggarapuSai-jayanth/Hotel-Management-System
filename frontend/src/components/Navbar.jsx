import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, KeyRound, LogOut } from 'lucide-react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

const Navbar = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:5001/api/auth/google', {
                token: credentialResponse.credential
            });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);
        } catch (error) {
            console.error('Google Sign In Failed', error);
            alert('Sign in failed!');
        }
    };

    const handleLogout = () => {
        googleLogout();
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/home" className="flex items-center space-x-2 text-blue-600">
                        <Hotel className="h-8 w-8" />
                        <span className="font-bold text-xl tracking-tight hidden sm:block">LuxeStays</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition">
                                <KeyRound className="h-5 w-5" />
                                <span className="font-medium mr-2">Admin</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link to="/profile" className="text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition px-3 py-1.5 rounded-full ring-2 ring-transparent focus:ring-blue-300">
                                    {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="scale-90 sm:scale-100 origin-right">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    theme="filled_blue"
                                    shape="pill"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
