import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, CheckCircle, CreditCard, ChevronLeft } from 'lucide-react';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/hotels/${id}`);
                setHotel(res.data);
            } catch (err) {
                console.error("Failed to fetch hotel details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    const handleBooking = async (room) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Please login to book a room.');
            return;
        }
        const currentUser = JSON.parse(storedUser);

        setProcessingPayment(true);
        try {
            // 1. Create a Booking Order via our backend
            const bookingData = {
                user: currentUser._id,
                hotel: hotel._id,
                roomType: room.type,
                checkIn: new Date().toISOString(),
                checkOut: new Date(Date.now() + 86400000).toISOString(), // 1 day later
                totalAmount: room.price
            };

            const res = await axios.post('http://localhost:5001/api/bookings', bookingData);
            const { orderId, amount, currency, booking } = res.data;

            const configRes = await axios.get('http://localhost:5001/api/config/razorpay');
            const razorpayKey = configRes.data.key_id;

            // 2. Open Razorpay Checkout modal
            const options = {
                key: razorpayKey, // Fetched from backend
                amount: amount,
                currency: currency,
                name: "LuxeStays Booking",
                description: `Booking for ${hotel.name} - ${room.type}`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await axios.post('http://localhost:5001/api/bookings/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            booking_id: booking._id
                        });
                        alert('Payment Successful & Booking Confirmed!');
                        navigate('/profile');
                    } catch (error) {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: "Test User",
                    email: "test.user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2563eb"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed. Reason: " + response.error.description);
            });
            rzp1.open();
        } catch (err) {
            console.error(err);
            alert('Error initiating checkout. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading hotel details...</div>;
    if (!hotel) return <div className="min-h-screen pt-24 text-center">Hotel not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Image */}
            <div className="h-64 sm:h-96 w-full relative">
                <img
                    src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
                    <button onClick={() => navigate(-1)} className="text-white mb-4 hover:text-blue-200 flex items-center text-sm font-medium transition">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to listings
                    </button>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 shadow-sm">{hotel.name}</h1>
                    <p className="text-slate-200 flex items-center text-lg">
                        <MapPin className="h-5 w-5 mr-2 text-white/80" /> {hotel.location?.address}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6">About this Property</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">{hotel.description}</p>
                    </section>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold border-b border-slate-200 pb-3 mb-6">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {hotel.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center text-slate-700 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                        <span className="font-medium">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Booking Sidebar */}
                <div>
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <CreditCard className="mr-2 h-6 w-6 text-blue-600" /> Book a Room
                        </h3>

                        {hotel.rooms && hotel.rooms.length > 0 ? (
                            <div className="space-y-4">
                                {hotel.rooms.map((room, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border-2 transition ${room.available ? 'border-slate-200 hover:border-blue-500 cursor-pointer' : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg text-slate-900">{room.type}</h4>
                                            <span className="text-blue-600 font-bold text-xl">₹{room.price}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4 flex items-center">
                                            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-slate-400"></span> Capacity: {room.capacity} Guests
                                        </p>
                                        <button
                                            onClick={() => handleBooking(room)}
                                            disabled={!room.available || processingPayment}
                                            className="w-full py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                                        >
                                            {processingPayment ? 'Processing...' : (room.available ? 'Book Now & Pay' : 'Sold Out')}
                                        </button>
                                        {(room.available && !window.Razorpay) && (
                                            <p className="text-xs text-red-500 mt-2 text-center">Razorpay not loaded. Missing credentials.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-slate-100 italic">No rooms available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
