import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Star, Search, Calendar, Users, Compass } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [20.5937, 78.9629]; // India default center [lat, lng]

const Home = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchGuests, setSearchGuests] = useState('');

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/hotels');
                setHotels(res.data);
                setFilteredHotels(res.data);
            } catch (err) {
                console.error("Failed to fetch hotels:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    // Initialize Map Only Once
    useEffect(() => {
        if (!mapRef.current) return;

        // Prevent re-initialization in Strict Mode
        if (mapInstance.current) {
            mapInstance.current.off();
            mapInstance.current.remove();
        }

        mapInstance.current = L.map(mapRef.current, {
            center: defaultCenter,
            zoom: 5,
            scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance.current);

        return () => {
            if (mapInstance.current) {
                mapInstance.current.off();
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update Map Markers and Center 
    useEffect(() => {
        if (!mapInstance.current) return;

        // Clear old markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        filteredHotels.forEach(hotel => {
            if (hotel?.location?.lat && hotel?.location?.lng) {
                const marker = L.marker([hotel.location.lat, hotel.location.lng])
                    .addTo(mapInstance.current)
                    .bindPopup(`
                    <div class="p-1 min-w-[200px] font-sans">
                        <div class="h-24 w-full rounded-md overflow-hidden mb-3">
                            <img src="${hotel.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'}" alt="${hotel.name.replace(/"/g, '&quot;')}" class="w-full h-full object-cover" />
                        </div>
                        <h3 class="font-bold text-slate-800 text-base mb-1">${hotel.name}</h3>
                        <p class="text-slate-500 text-xs flex items-center mb-2">
                            ${hotel.location?.address || ''}
                        </p>
                        ${hotel.rooms && hotel.rooms.length > 0 ? `<p class="text-blue-600 font-bold mt-2 pt-2 border-t border-slate-100">₹${hotel.rooms[0].price} <span class="text-slate-400 font-normal text-xs">/ night</span></p>` : ''}
                        <a href="/hotel/${hotel._id}" class="block w-full text-center bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold mt-3 hover:bg-slate-800 transition">View</a>
                    </div>
                `);
                markersRef.current.push(marker);
            }
        });

        // Re-center map if there are results
        if (filteredHotels.length > 0 && filteredHotels[0].location?.lat) {
            mapInstance.current.flyTo([filteredHotels[0].location.lat, filteredHotels[0].location.lng], 5, { duration: 1.5 });
        }

    }, [filteredHotels]);

    const handleSearch = () => {
        let filtered = hotels;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(hotel =>
                hotel.name.toLowerCase().includes(query) ||
                (hotel.location && hotel.location.address && hotel.location.address.toLowerCase().includes(query)) ||
                (hotel.description && hotel.description.toLowerCase().includes(query))
            );
        }

        if (searchGuests) {
            const guests = parseInt(searchGuests, 10);
            filtered = filtered.filter(hotel =>
                hotel.rooms && hotel.rooms.some(room => room.capacity >= guests)
            );
        }

        setFilteredHotels(filtered);

        // Scroll to properties section if it exists, offset by navbar height
        const section = document.getElementById('properties-section');
        if (section) {
            const yOffset = -100; // Account for sticky navbar
            const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen">
            {/* Premium Hero Section */}
            <div className="relative bg-slate-900 overflow-visible h-[80vh] min-h-[600px] flex items-center mb-32">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-c53cd4538862?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Luxury Hotel Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-16">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            Experience <br />
                            <span className="text-blue-400">Unrivaled Luxury.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-200 max-w-2xl font-light mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                            Discover premium properties, exclusive resorts, and breathtaking vacation rentals around the globe.
                        </p>
                    </div>
                </div>

                {/* Floating Search Bar (Visual/Interactive element) */}
                <div className="absolute -bottom-16 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="bg-white rounded-full shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100 p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <div className="flex-1 flex items-center px-4 border-b md:border-none border-slate-100 w-full pb-4 md:pb-0">
                            <MapPin className="h-6 w-6 text-blue-500 flex-shrink-0" />
                            <div className="ml-3 w-full">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</label>
                                <input
                                    type="text"
                                    placeholder="Where are you going?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full bg-transparent border-none text-slate-800 font-semibold focus:outline-none focus:ring-0 p-0 text-lg placeholder:font-normal placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                        <div className="flex-1 flex items-center px-4 w-full border-b md:border-none border-slate-100 pb-4 md:pb-0">
                            <Calendar className="h-6 w-6 text-blue-500 flex-shrink-0" />
                            <div className="ml-3 w-full">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Dates</label>
                                <input
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    className="w-full bg-transparent border-none text-slate-800 font-semibold focus:outline-none focus:ring-0 p-0 text-lg placeholder:font-normal placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                        <div className="flex-1 flex items-center px-4 w-full border-b md:border-none border-slate-100 pb-4 md:pb-0">
                            <Users className="h-6 w-6 text-blue-500 flex-shrink-0" />
                            <div className="ml-3 w-full">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Guests</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Add guests"
                                    value={searchGuests}
                                    onChange={(e) => setSearchGuests(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full bg-transparent border-none text-slate-800 font-semibold focus:outline-none focus:ring-0 p-0 text-lg placeholder:font-normal placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 md:px-8 md:py-4 transition-all duration-300 shadow-lg hover:shadow-xl w-full md:w-auto flex justify-center items-center group">
                            <Search className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-lg hidden md:block">Search</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Explore Destinations Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                            <Compass className="h-8 w-8 text-blue-500 mr-3 hidden sm:block" /> Explore Popular Destinations
                        </h2>
                        <p className="text-slate-500 mt-2 text-lg">Find inspiration for your next unforgettable journey.</p>
                    </div>
                    <button
                        onClick={() => {
                            const section = document.getElementById('properties-section');
                            if (section) {
                                const yOffset = -100;
                                const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                        }}
                        className="text-blue-600 font-bold hover:text-blue-700 transition flex items-center"
                    >
                        View all properties <span className="ml-1">→</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
                    {/* Main large card */}
                    <div className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 h-72 md:h-auto">
                        <img
                            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Goa, India"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block shadow-sm">Popular</span>
                            <h3 className="text-4xl font-bold text-white mb-2">Goa, India</h3>
                            <p className="text-slate-200 font-medium tracking-wide">150+ Premium Beach Resorts</p>
                        </div>
                    </div>

                    {/* Small card top */}
                    <div className="md:col-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 h-64 md:h-auto">
                        <img
                            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Agra, Uttar Pradesh"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">Agra, Uttar Pradesh</h3>
                            <p className="text-slate-200 text-sm font-medium tracking-wide">Heritage Properties</p>
                        </div>
                    </div>

                    {/* Small card bottom left */}
                    <div className="md:col-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 h-56 md:h-auto">
                        <img
                            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                            alt="Kerala, India"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Kerala</h3>
                            <p className="text-slate-200 text-xs font-medium tracking-wide">Serene Backwaters</p>
                        </div>
                    </div>

                    {/* Small card bottom right */}
                    <div className="md:col-span-1 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 h-56 md:h-auto">
                        <img
                            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                            alt="Jaipur, Rajasthan"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">Jaipur</h3>
                            <p className="text-slate-200 text-xs font-medium tracking-wide">Royal Palaces</p>
                        </div>
                    </div>
                </div>
            </div>

            <div id="properties-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Hotel Listings */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Top Rated Properties</h2>
                                <p className="text-slate-500 mt-2">Handpicked luxury stays for your next getaway.</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex flex-col sm:flex-row bg-white rounded-3xl p-4 gap-6">
                                        <div className="sm:w-1/3 h-48 bg-slate-200 rounded-2xl"></div>
                                        <div className="flex-1 space-y-4 py-2">
                                            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                            <div className="h-20 bg-slate-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredHotels.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                <Building2 className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium text-lg">No properties found matching your search.</p>
                                <button onClick={() => { setSearchQuery(''); setSearchDate(''); setSearchGuests(''); setFilteredHotels(hotels); }} className="text-blue-500 hover:text-blue-600 mt-2 text-sm font-semibold">Clear search constraints</button>
                            </div>
                        ) : (
                            filteredHotels.map(hotel => (
                                <div key={hotel._id} className="group bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 border border-slate-100/50 overflow-hidden flex flex-col sm:flex-row p-3 gap-6">
                                    <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden rounded-[1.5rem] relative">
                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center">
                                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-current mr-1" />
                                            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">Premium</span>
                                        </div>

                                        <img
                                            src={hotel.images[0] || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="p-2 sm:p-4 flex flex-col justify-between flex-grow">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight pr-4">{hotel.name}</h3>
                                                <div className="flex items-center space-x-1 bg-yellow-50 px-2.5 py-1 rounded-lg">
                                                    <span className="font-bold text-sm text-yellow-700">{hotel.rating || '5.0'}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 font-medium text-sm flex items-center mb-4">
                                                <MapPin className="h-4 w-4 mr-1 text-slate-400" /> {hotel.location?.address}
                                            </p>
                                            <p className="text-slate-600 line-clamp-2 leading-relaxed">{hotel.description}</p>
                                        </div>

                                        <div className="mt-8 flex justify-between items-end border-t border-slate-100 pt-5">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starting from</p>
                                                {hotel.rooms && hotel.rooms.length > 0 ? (
                                                    <div className="flex items-baseline space-x-1">
                                                        <span className="text-2xl font-bold text-slate-900">₹{hotel.rooms[0].price}</span>
                                                        <span className="text-sm font-medium text-slate-500">/ night</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-medium text-slate-500 italic">Pricing unavailable</p>
                                                )}
                                            </div>
                                            <Link to={`/hotel/${hotel._id}`} className="bg-slate-900 text-white hover:bg-blue-600 px-6 py-3 rounded-xl font-bold transition-colors duration-300 shadow-sm">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Integrated Map View */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-28" style={{ zIndex: 0 }}>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center tracking-tight">
                                <Search className="h-6 w-6 text-slate-400 mr-2" /> Explore the Map
                            </h2>
                            <div className="bg-white p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                                <div className="rounded-[1.5rem] overflow-hidden bg-slate-100 relative h-[600px] z-0">
                                    <div ref={mapRef} className="w-full h-full relative z-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
