import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Users,
    Droplets,
    Zap,
    ChevronRight,
    BarChart3,
    Heart,
    ArrowUpRight,
    Info,
    ExternalLink,
    Activity,
    ShieldCheck,
    Cpu
} from 'lucide-react';

const impactData = {
    'Plastic': {
        from: 'Plastic Bottles',
        to: 'Sustainable Apparel',
        stat: '1,000 People',
        result: '2,500 Eco-fleece Jackets',
        description: 'Recycling PET plastics reduces energy use by 66% and stops microplastics from entering the food chain.',
        color: 'emerald',
        baseWater: 3.8, // L per item
        baseEnergy: 0.45, // kWh per item
        source: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/plastics-material-specific-data'
    },
    'Organic': {
        from: 'Food Scraps',
        to: 'Clean Bio-Energy',
        stat: '1,000 People',
        result: 'Power for 100 Streetlights',
        description: 'Organic waste processed in anaerobic digesters creates methane-free power and bio-fertilizer.',
        color: 'amber',
        baseWater: 1.2,
        baseEnergy: 0.08,
        source: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/food-material-specific-data'
    },
    'Glass': {
        from: 'Glass Bottles',
        to: 'New Glassware',
        stat: '1,000 People',
        result: '4,000 New Containers',
        description: 'Glass is infinitely recyclable. Using recycled glass saves 40% of the energy needed for new glass.',
        color: 'blue',
        baseWater: 2.5,
        baseEnergy: 0.31,
        source: 'https://www.gpi.org/glass-recycling-facts'
    },
    'Paper': {
        from: 'Mixed Paper',
        to: 'Recycled Fiber',
        stat: '1,000 People',
        result: '170 Mature Trees Saved',
        description: 'Recycling one ton of paper saves enough energy to power an average home for six months.',
        color: 'cyan',
        baseWater: 7.0,
        baseEnergy: 0.58,
        source: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/paper-and-paperboard-material-specific-data'
    },
    'Hazardous': {
        from: 'Electronic Waste',
        to: 'Rare Metal Recovery',
        stat: '1,000 People',
        result: '15kg of Recovered Copper',
        description: 'Urban mining of electronics recovers 50x more gold per ton than traditional mining.',
        color: 'red',
        baseWater: 15.0,
        baseEnergy: 1.2,
        source: 'https://www.unep.org/news-and-stories/story/waste-wealth-turning-e-waste-opportunity'
    },
    'Metal': {
        from: 'Aluminum Cans',
        to: 'Bicycle Frames',
        stat: '1,000 People',
        result: '25 High-End Bike Frames',
        description: 'Recycling aluminum saves 95% of the energy used to make it from raw materials.',
        color: 'indigo',
        baseWater: 5.2,
        baseEnergy: 0.95,
        source: 'https://www.aluminum.org/Recycling'
    }
};

const ImpactScreen = ({ item, history = [] }) => {
    const [lastClicked, setLastClicked] = useState(null);
    const itemType = item?.itemType?.toLowerCase() || '';
    const bin = item?.bin || 'Recycle';

    // 1. Intelligent matching logic (Memoized)
    const entry = useMemo(() => {
        let match = Object.entries(impactData).find(([key]) =>
            itemType.includes(key.toLowerCase()) ||
            (key === 'Metal' && (itemType.includes('can') || itemType.includes('tin')))
        )?.[1];

        return match || impactData[bin] || impactData['Plastic'];
    }, [itemType, bin]);

    // 2. Personal Stats Calculation
    const personalCount = history.filter(h => h.bin === bin).length;
    const personalWater = (personalCount * entry.baseWater).toFixed(1);

    const themeClass = entry.color === 'emerald' ? 'from-emerald-400 to-teal-500' :
        entry.color === 'amber' ? 'from-amber-400 to-orange-500' :
            entry.color === 'blue' ? 'from-blue-400 to-indigo-500' :
                entry.color === 'red' ? 'from-red-400 to-rose-500' :
                    entry.color === 'indigo' ? 'from-indigo-400 to-purple-500' : 'from-cyan-400 to-blue-500';

    const handleCardClick = (id) => {
        setLastClicked(id);
        setTimeout(() => setLastClicked(null), 1000);
    };

    return (
        <div className="min-h-full pb-32 pt-8">
            {/* Header: Centered & Modern */}
            <header className="px-6 mb-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-4">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black tracking-[0.3em] uppercase text-gray-400">Regional Impact Engine</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">GLOBAL SYNC</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bridging local action with global consequence</p>
            </header>

            <div className="px-6 space-y-6">

                {/* YOUR PERSONAL CONTRIBUTION - The "Bridge" */}
                <div className="glass-card p-6 border-white/5 relative overflow-hidden bg-slate-900/40">
                    <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                        <Cpu size={120} />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500" size={16} />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Your Identity Impact</h3>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-lg border border-emerald-500/20">VERIFIED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div>
                            <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">Items Processed</p>
                            <p className="text-3xl font-black text-white">{personalCount || '0'}<span className="text-[10px] text-gray-700 ml-1">UNITS</span></p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">H2O Offset</p>
                            <p className="text-3xl font-black text-white">{personalWater}<span className="text-[10px] text-gray-700 ml-1">LITERS</span></p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-1">
                            <Activity size={12} className="text-blue-400" />
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-gray-500">Live Grid Multiplier: 1:1,000</span>
                        </div>
                        <ArrowRightCircle size={12} className="text-gray-700" />
                    </div>
                </div>

                {/* THE GLOBAL "UNIVERSE" SECTION */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCardClick('main')}
                    className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${themeClass} p-8 shadow-2xl cursor-pointer group`}
                >
                    <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
                        <Users size={120} className="group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe size={14} className="text-white/80 animate-spin-slow" />
                            <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">Community Projection</span>
                        </div>

                        <h2 className="text-2xl font-black text-white mb-8 leading-tight">
                            If <span className="underline decoration-white/40 underline-offset-8 decoration-2">{entry.stat}</span> joined your mission...
                        </h2>

                        <div className="flex items-center justify-between mb-8 px-4">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl mb-3 shadow-inner">
                                    📦
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{entry.from}</span>
                            </div>

                            <motion.div
                                animate={{ x: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-white/40"
                            >
                                <ChevronRight size={32} />
                            </motion.div>

                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/30 rounded-[1.5rem] backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl mb-3 shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]">
                                    ✨
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Result</span>
                            </div>
                        </div>

                        <div className="bg-white text-black p-5 rounded-3xl text-center shadow-2xl">
                            <p className="text-lg font-black uppercase tracking-tight">
                                {entry.result}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* THE DATA BREAKDOWN */}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard
                        label="Community Water"
                        value={`${(entry.baseWater * 1000).toLocaleString()}L`}
                        icon={<Droplets className="text-blue-400" size={18} />}
                    />
                    <StatCard
                        label="Community Energy"
                        value={`${(entry.baseEnergy * 1000).toLocaleString()}kWh`}
                        icon={<Zap className="text-yellow-400" size={18} />}
                    />
                </div>

                {/* SCIENTIFIC VALIDATION */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(entry.source, '_blank')}
                    className="glass-card p-6 border-white/5 bg-slate-900/20 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
                        <BarChart3 size={100} />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Verification Engine</h3>
                        </div>
                        <ExternalLink size={14} className="text-gray-700 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed font-bold italic mb-4">
                        "{entry.description}"
                    </p>
                    <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase tracking-widest border-t border-white/5 pt-4">
                        See Authentic Calculations on EPA.gov
                        <ArrowUpRight size={12} />
                    </div>
                </motion.div>

                {/* LIVE COMMUNITY HEARTBEAT */}
                <div className="glass-card p-6 border-white/10 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-500 shrink-0 shadow-inner">
                            <Heart fill="currentColor" size={24} className="animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-sm uppercase italic">Global Heartbeat</h4>
                            <p className="text-gray-500 text-[10px] font-bold uppercase mt-1 tracking-tighter">52,192 Heroes Active Today</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Feedback Pop-up */}
            <AnimatePresence>
                {lastClicked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.3em] z-50 shadow-2xl flex items-center gap-3"
                    >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        Syncing Regional Grid
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

function StatCard({ icon, label, value }) {
    return (
        <div className="glass-card p-5 border-white/5 bg-slate-900/40">
            <div className="mb-4 text-gray-500">{icon}</div>
            <h4 className="text-[9px] font-bold text-gray-600 uppercase mb-1 tracking-tighter">{label}</h4>
            <p className="text-xl font-black text-white">{value}</p>
        </div>
    );
}

// Internal helper icons
const ArrowRightCircle = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><path d="m12 16 4-4-4-4" /><path d="M8 12h8" />
    </svg>
);

export default ImpactScreen;
