import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, ShieldCheck, CalendarDays, MapPin } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchBookings(parsedUser._id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchBookings = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5001/api/bookings/user/${userId}`);
            setBookings(res.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen pt-24 text-center text-slate-500">Loading profile...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md w-full">
                    <User className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Not Logged In</h2>
                    <p className="text-slate-500 mb-6">Please log in using Google to view your profile and booking history.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
                <User className="h-8 w-8 mr-3 text-blue-600" /> My Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-slate-500 flex items-center justify-center mt-2">
                                <Mail className="h-4 w-4 mr-1.5" /> {user.email}
                            </p>
                        </div>
                        <div className="pt-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Role</span>
                                <span className="font-medium text-slate-800 flex items-center bg-slate-100 px-2.5 py-1 rounded-full">
                                    <ShieldCheck className="h-4 w-4 mr-1 text-slate-500" /> {user.role}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Account Status</span>
                                <span className="font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <CalendarDays className="h-5 w-5 mr-2 text-blue-600" /> Booking History
                            </h2>
                        </div>

                        <div className="p-6">
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <CalendarDays className="h-12 w-12 mx-auto text-slate-200 mb-3" />
                                    <p className="text-slate-500 text-lg mb-1">No bookings yet</p>
                                    <p className="text-slate-400 text-sm">When you book a hotel, it will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {bookings.map((booking) => (
                                        <div key={booking._id} className="block border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        {booking.hotel ? booking.hotel.name : 'Unknown Hotel'}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 flex items-center mt-1">
                                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                                        {booking.hotel?.location?.address || 'Address unavailable'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-xs uppercase tracking-wider">
                                                        {booking.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
                                                <div>
                                                    <p className="text-slate-500 mb-1">Room</p>
                                                    <p className="font-medium text-slate-800">{booking.roomType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 mb-1">Check In</p>
                                                    <p className="font-medium text-slate-800">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 mb-1">Check Out</p>
                                                    <p className="font-medium text-slate-800">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500 mb-1">Total Paid</p>
                                                    <p className="font-bold text-blue-600">₹{booking.totalAmount}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
