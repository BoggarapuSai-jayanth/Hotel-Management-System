import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const adminId = req.user._id;
        const totalProperties = await Hotel.countDocuments({ adminId });

        // First find the IDs of all hotels owned by this admin
        const adminHotels = await Hotel.find({ adminId }).select('_id');
        const hotelIds = adminHotels.map(h => h._id);

        // Get bookings to calculate total guests, revenue, active bookings AND populate for detailed view
        const bookings = await Booking.find({ hotel: { $in: hotelIds } })
            .populate('user', 'name email')
            .populate('hotel', 'name location.address')
            .sort({ createdAt: -1 });

        const uniqueUsers = new Set();
        let totalRevenue = 0;
        let activeBookings = 0;

        bookings.forEach(booking => {
            uniqueUsers.add(booking.user.toString());
            if (booking.paymentStatus === 'completed') {
                totalRevenue += booking.totalAmount;
            }
            // For demo purposes, consider all successful bookings as active
            if (booking.paymentStatus !== 'failed') {
                activeBookings++;
            }
        });

        const totalGuests = uniqueUsers.size;

        res.json({
            totalProperties,
            totalGuests,
            totalRevenue,
            activeBookings,
            recentBookings: bookings.slice(0, 10) // Return top 10 most recent bookings for table
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
