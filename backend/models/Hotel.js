import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: [String],
    available: { type: Boolean, default: true }
});

const hotelSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    images: [String],
    amenities: [String],
    rooms: [roomSchema],
    rating: { type: Number, default: 0 },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number },
        comment: { type: String }
    }]
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
