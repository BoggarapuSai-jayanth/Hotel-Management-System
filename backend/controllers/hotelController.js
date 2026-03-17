import Hotel from '../models/Hotel.js';

// @desc    Fetch all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({});
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a hotel (Admin only mock)
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res) => {
    try {
        const hotelData = {
            ...req.body,
            adminId: req.user._id
        };
        const hotel = new Hotel(hotelData);
        const createdHotel = await hotel.save();
        res.status(201).json(createdHotel);
    } catch (error) {
        res.status(400).json({ message: 'Invalid hotel data', error });
    }
};
