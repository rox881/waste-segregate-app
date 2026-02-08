import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, Globe, X, ExternalLink, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

const MOCK_CENTERS = [
    {
        id: 1,
        name: "Eco-Tech Solutions (E-Waste)",
        address: "123 Green Avenue, Electronics District",
        distance: "1.2 km",
        type: "Hazardous / Electronics",
        open: "9:00 AM - 6:00 PM",
        phone: "+91 98765 43210",
        accepts: ["Batteries", "Phones", "Laptops", "Circuit Boards"]
    },
    {
        id: 2,
        name: "Renewable Paper Hub",
        address: "45 Industrial Estate, North Side",
        distance: "2.5 km",
        type: "Recyclables",
        open: "10:00 AM - 8:00 PM",
        phone: "+91 98765 00001",
        accepts: ["Paper", "Cardboard", "Books", "Cartons"]
    },
    {
        id: 3,
        name: "Smart Glass & Metal Depot",
        address: "78 Circular Road, Downtown",
        distance: "3.8 km",
        type: "Recyclables",
        open: "8:00 AM - 5:00 PM",
        phone: "+91 98765 00002",
        accepts: ["Glass Bottles", "Tin Cans", "Aluminum", "Vases"]
    },
    {
        id: 4,
        name: "Bio-Fertilizer Organic Center",
        address: "12 Nature Lane, South Park",
        distance: "4.1 km",
        type: "Organic / Bio-Waste",
        open: "6:00 AM - 2:00 PM",
        phone: "+91 98765 00003",
        accepts: ["Food Scraps", "Peels", "Coffee Grounds", "Garden Waste"]
    }
];

const DropOffFinder = ({ isOpen, onClose, filterType }) => {
    const [centers, setCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchRealCenters();
        }
    }, [isOpen]);

    const fetchRealCenters = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Get User Location with better timeout handling
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true, // Try with GPS first
                    timeout: 10000, // Wait 10 seconds
                    maximumAge: 60000 // Reuse location from last minute
                });
            }).catch(() => {
                // Try one more time with lower accuracy (faster/more reliable)
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: false,
                        timeout: 5000
                    });
                });
            });

            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });

            // 2. Fetch from OpenStreetMap (Overpass API)
            // Query for recycling amenities within 10km (10000m)
            const query = `[out:json];node["amenity"="recycling"](around:10000,${latitude},${longitude});out;`;
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodedQuery}`);
            const data = await response.json();

            if (data.elements && data.elements.length > 0) {
                const realCenters = data.elements.map(el => {
                    // Calculate simple distance (Euclidean approx for display)
                    const dLat = el.lat - latitude;
                    const dLon = el.lon - longitude;
                    const km = Math.sqrt(dLat * dLat + dLon * dLon) * 111; // Approx km

                    return {
                        id: el.id,
                        name: el.tags.name || "Recycling Point",
                        address: el.tags['addr:full'] || el.tags['addr:street'] || "Local Collection Point",
                        distance: `${km.toFixed(1)} km`,
                        type: el.tags.recycling_type || "General Recycling",
                        open: el.tags.opening_hours || "Contact for hours",
                        phone: el.tags.phone || "Multiple locations",
                        accepts: Object.keys(el.tags)
                            .filter(k => k.startsWith('recycling:') && el.tags[k] === 'yes')
                            .map(k => k.replace('recycling:', '').charAt(0).toUpperCase() + k.replace('recycling:', '').slice(1))
                            .slice(0, 4) || ["General Waste"]
                    };
                }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

                setCenters(realCenters.slice(0, 10)); // Top 10 nearest
            } else {
                // If no OSM data found nearby, we use expanded mock data for demo safety
                setCenters(MOCK_CENTERS);
            }
        } catch (err) {
            console.error("Location/OSM Error:", err);
            setError("Location timed out. Showing nearby regional hubs.");
            // Set a default center point (e.g., Delhi/Central) for the demo
            setUserLocation({ lat: 28.6139, lon: 77.2090 });
            setCenters(MOCK_CENTERS);
        } finally {
            setIsLoading(false);
        }
    };

    // Simple priority sorting based on the item category
    const sortedCenters = [...centers].sort((a, b) => {
        if (filterType === 'Hazardous' && a.type.toLowerCase().includes('haz')) return -1;
        if (filterType === 'Recycle' && a.type.toLowerCase().includes('rec')) return -1;
        return 0;
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#0d1526] rounded-t-[40px] z-[101] shadow-2xl border-t border-white/10 overflow-hidden flex flex-col"
                    >
                        {/* Header Handle */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2" />

                        <div className="px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Drop-off Locator</h2>
                                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">REAL-TIME DISCOVERY FOR {filterType || 'All Items'}</p>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-4">
                            {isLoading ? (
                                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] text-center">
                                        SCANNING PLANETARY COORDINATES...<br />
                                        <span className="text-emerald-500/40">ACCESSING OPENSTREETMAP DATABASE</span>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Map Preview Mock */}
                                    <div className="w-full h-40 bg-slate-800 rounded-3xl relative overflow-hidden border border-white/5 mb-6">
                                        {userLocation ? (
                                            <div className="absolute inset-0 bg-[#1a2233]">
                                                {/* Simple Grid to mimic a map for demo */}
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full animate-ping" />
                                                        <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                                <p className="text-[10px] text-gray-500 font-black">LOCATION DENIED</p>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-2 px-4 rounded-full border border-white/10 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                                                {userLocation ? `LAT: ${userLocation.lat.toFixed(2)} LON: ${userLocation.lon.toFixed(2)}` : 'USING DEFAULT COORDINATES'}
                                            </span>
                                            <Navigation size={12} className="text-emerald-500" />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                                            <AlertTriangle size={16} className="text-amber-500" />
                                            <p className="text-[10px] text-amber-500 font-bold uppercase">{error}</p>
                                        </div>
                                    )}

                                    {/* Results */}
                                    {sortedCenters.map((center) => (
                                        <CenterCard
                                            key={center.id}
                                            center={center}
                                            isRecommended={
                                                (filterType === 'Hazardous' && center.type.toLowerCase().includes('haz')) ||
                                                (filterType === 'Recycle' && center.type.toLowerCase().includes('rec'))
                                            }
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

function CenterCard({ center, isRecommended }) {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            className={`glass-card p-5 border-white/5 hover:border-emerald-500/30 transition-all ${isRecommended ? 'ring-2 ring-emerald-500/20 bg-emerald-500/[0.02]' : ''}`}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-md font-black text-white leading-tight">{center.name}</h3>
                        {isRecommended && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{center.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-black text-white">{center.distance}</p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">away</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {center.accepts.map((tag, i) => (
                    <span key={i} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded-md text-gray-400 border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-emerald-500/60" />
                    <p className="text-[10px] text-gray-400 font-bold">{center.open}</p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <Phone size={12} className="text-emerald-500/60" />
                    <p className="text-[10px] text-gray-400 font-bold">{center.phone}</p>
                </div>
            </div>

            <button className="w-full mt-4 bg-emerald-500 py-3 rounded-2xl flex items-center justify-center gap-2 text-black font-black text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                <Navigation size={14} />
                START NAVIGATION
                <ChevronRight size={14} />
            </button>
        </motion.div>
    );
}

export default DropOffFinder;
