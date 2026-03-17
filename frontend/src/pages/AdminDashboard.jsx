import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, CheckCircle2, Users, DollarSign, CalendarCheck, Clock, MapPin } from 'lucide-react';
const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        lat: '',
        lng: '',
        roomType: 'Deluxe',
        roomPrice: '',
        roomCapacity: '',
        galleryImages: [''] // Array to hold individual image URLs
    });

    const [stats, setStats] = useState({
        totalProperties: 0,
        totalGuests: 0,
        totalRevenue: 0,
        activeBookings: 0,
        recentBookings: []
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // Fetch stats on load and check auth
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');

        if (!storedUser || storedUser.role !== 'admin' || !storedToken) {
            navigate('/home');
            return;
        }

        setToken(storedToken);

        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/stats', {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching admin stats:", err);
            }
        };
        fetchStats();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGalleryChange = (index, value) => {
        const newGallery = [...formData.galleryImages];
        newGallery[index] = value;
        setFormData({ ...formData, galleryImages: newGallery });
    };

    const addGalleryInput = () => {
        setFormData({ ...formData, galleryImages: [...formData.galleryImages, ''] });
    };

    const removeGalleryInput = (index) => {
        const newGallery = formData.galleryImages.filter((_, i) => i !== index);
        setFormData({ ...formData, galleryImages: newGallery.length ? newGallery : [''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newHotel = {
                name: formData.name,
                description: formData.description,
                location: {
                    address: formData.address,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng)
                },
                images: formData.galleryImages.map(img => img.trim()).filter(Boolean),
                amenities: ["Free Wi-Fi", "Pool", "Spa", "Restaurant"], // Default for demo
                rooms: [{
                    type: formData.roomType,
                    price: parseInt(formData.roomPrice),
                    capacity: parseInt(formData.roomCapacity),
                    available: true
                }]
            };

            await axios.post('http://localhost:5001/api/hotels', newHotel, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg(`Hotel "${formData.name}" officially registered!`);
            setFormData({
                name: '', description: '', address: '', lat: '', lng: '', roomType: 'Deluxe', roomPrice: '', roomCapacity: '', galleryImages: ['']
            });

            // Refresh stats to include new hotel
            try {
                const res = await axios.get('http://localhost:5001/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (e) { }

            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            alert("Error adding hotel");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-3 mb-8">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
            </div>

            {/* Dashboard Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                        <Building2 className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Properties</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalProperties}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mr-4">
                        <DollarSign className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-800">₹{stats.totalRevenue > 100000 ? (stats.totalRevenue / 100000).toFixed(1) + 'L' : stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mr-4">
                        <CalendarCheck className="h-7 w-7 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Active Bookings</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.activeBookings}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                        <Users className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Guests</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalGuests}</p>
                    </div>
                </div>
            </div>

            {successMsg && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="mr-3 h-6 w-6 flex-shrink-0" />
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            {/* Add Property Form */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        <PlusCircle className="mr-3 h-6 w-6 text-blue-500" />
                        List a New Property
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm ml-9">Fill out the details below to add a new hotel or resort to the platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-10">

                    {/* General Information Section */}
                    <div className="space-y-5">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                            <span className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">General Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm" placeholder="e.g. Grand Plaza Resort" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <input required type="text" name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm" placeholder="Short description of the property" />
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="space-y-5 border-t border-slate-100 pt-8">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                            <span className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Property Gallery</h3>
                        </div>
                        <div className="space-y-4">
                            {formData.galleryImages.map((imgUrl, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className="flex-grow w-full">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Image URL {index + 1}</label>
                                        <div className="flex relative">
                                            <input
                                                type="url"
                                                value={imgUrl}
                                                onChange={(e) => handleGalleryChange(index, e.target.value)}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.galleryImages.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryInput(index)}
                                                    className="ml-2 text-red-500 hover:bg-red-50 p-2.5 rounded-lg border border-red-100 transition"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {/* Image Preview */}
                                    <div className="w-full sm:w-32 h-24 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center relative">
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIgMTRwbDcuNS03LjVaIi8+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiLz48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiIvPjwvc3ZnPg=='; }} />
                                        ) : (
                                            <span className="text-xs font-medium text-slate-400">Preview</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addGalleryInput}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-blue-100 flex items-center"
                            >
                                <PlusCircle className="mr-1.5 h-4 w-4" /> Add Another Image
                            </button>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-5 border-t border-slate-100 pt-8">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                            <span className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Location Details</h3>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Address String</label>
                            <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm" placeholder="123 Ocean Drive, Miami, FL" />
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Latitude</label>
                                <input required step="any" type="number" name="lat" value={formData.lat} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm font-mono text-sm" placeholder="e.g. 25.7617" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Longitude</label>
                                <input required step="any" type="number" name="lng" value={formData.lng} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm font-mono text-sm" placeholder="e.g. -80.1918" />
                            </div>
                        </div>
                    </div>

                    {/* Room Offering Section */}
                    <div className="space-y-5 border-t border-slate-100 pt-8">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                            <span className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Initial Room Configuration</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Room Type</label>
                                <input required type="text" name="roomType" value={formData.roomType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm" placeholder="e.g. Presidential Suite" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹ / Night)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-400 font-medium">₹</span>
                                    </div>
                                    <input required type="number" name="roomPrice" value={formData.roomPrice} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm" placeholder="4500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Capacity (Persons)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input required type="number" name="roomCapacity" value={formData.roomCapacity} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm" placeholder="2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center ${loading ? 'cursor-wait' : 'hover:-translate-y-0.5'}`}
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <PlusCircle className="mr-2.5 h-5 w-5" /> Publish Property Listing
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent Bookings Table */}
            <div className="mt-12 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                            <Clock className="mr-3 h-6 w-6 text-blue-500" />
                            Recent Bookings
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm ml-9">Real-time overview of the latest reservations across your properties.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold">Guest</th>
                                <th className="px-6 py-4 font-semibold">Property</th>
                                <th className="px-6 py-4 font-semibold">Dates</th>
                                <th className="px-6 py-4 font-semibold">Room</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(!stats.recentBookings || stats.recentBookings.length === 0) ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        No recent bookings found for your properties.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-800">{booking.user?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-slate-500">{booking.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-800">{booking.hotel?.name || 'Unknown Hotel'}</div>
                                            <div className="text-xs text-slate-500 flex items-center mt-1">
                                                <MapPin className="h-3 w-3 mr-1 inline" />
                                                <span className="truncate max-w-[150px] inline-block align-bottom">{booking.hotel?.location?.address || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700">In: {new Date(booking.checkIn).toLocaleDateString()}</div>
                                            <div className="text-sm text-slate-700">Out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            {booking.roomType}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-blue-600">
                                            ₹{booking.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                                    booking.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
