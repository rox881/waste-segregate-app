import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Leaf,
    Recycle,
    TrendingUp,
    Calendar,
    Award,
    ChevronRight,
    Search,
    BookOpen,
    X,
    Info
} from 'lucide-react';

const ARTICLE_CONTENT = {
    'The Myth of Biodegradable Plastic': {
        content: `Biodegradable plastics are often marketed as a green solution, but the reality is complex. Most require highly specific industrial composting conditions—high heat, specific moisture, and specialized microbes—to actually break down. In a typical landfill or the ocean, they can persist for decades, just like traditional plastics.

Key Takeaways:
1. Always look for certifications like BPI or Tuv Austria.
2. Never mix biodegradable plastic with traditional recycling streams.
3. Backyard composting is rarely sufficient for bioplastics.`,
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"
    },
    'Mastering Home Composting': {
        content: `Home composting is the single most effective way to reduce your personal carbon footprint. By diverting food scraps from landfills, you prevent the production of methane gas and create nutrient-rich soil for your garden.

Step-by-Step:
1. 'Greens' (Nitrogen): Fruit/veg scraps, coffee grounds.
2. 'Browns' (Carbon): Dry leaves, cardboard, shredded paper.
3. Aeration: Turn the pile weekly to provide oxygen.
4. Moisture: Keep it damp like a wrung-out sponge.`,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
    }
};

const InsightsScreen = ({ history = [], onItemClick }) => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showBadgeDetails, setShowBadgeDetails] = useState(false);

    // Calculate dynamic stats
    const recycledCount = history.filter(item => item.bin === 'Recycle').length;
    const organicCount = history.filter(item => item.bin === 'Organic').length;
    const hazardousCount = history.filter(item => item.bin === 'Hazardous').length;

    // Total energy saved estimate (random multiplier for demo feel but based on count)
    const energySaved = (recycledCount * 0.15 + organicCount * 0.05).toFixed(1);

    const dynamicStats = [
        {
            id: 1,
            icon: <Recycle size={20} />,
            label: 'Recycled',
            value: recycledCount || '0',
            unit: 'items',
            color: 'emerald',
        },
        {
            id: 2,
            icon: <Leaf size={20} />,
            label: 'Organic',
            value: organicCount || '0',
            unit: 'items',
            color: 'amber',
        },
        {
            id: 3,
            icon: <Zap size={20} />,
            label: 'Energy Saved',
            value: energySaved || '0',
            unit: 'kWh',
            color: 'blue',
        },
    ];

    return (
        <div className="min-h-full pb-32 pt-8">
            {/* Header */}
            <header className="px-6 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">VITAL INSIGHTS</h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">Your Sustainability Scorecard</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <TrendingUp size={24} className="text-emerald-400" />
                </div>
            </header>

            <div className="px-6 space-y-6">

                {/* Daily Progress */}
                <div className="glass-card p-6 border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Calendar size={60} />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Activity Snapshot</h2>
                        <span className="text-[10px] font-bold text-emerald-400">SESSION</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {dynamicStats.map((item) => (
                            <div key={item.id} className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mb-3 text-${item.color}-400`}>
                                    {item.icon}
                                </div>
                                <span className="text-xl font-black text-white">{item.value}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{item.unit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Items List if history exists */}
                {history.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                            <TrendingUp size={14} className="text-emerald-500" />
                            Recent Discoveries
                        </h3>
                        <div className="space-y-2">
                            {history.slice(0, 5).map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onItemClick && onItemClick(item)}
                                    className="w-full glass-card p-4 flex items-center justify-between border-white/5 active:scale-[0.98] transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors`}>
                                            <Recycle size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-bold">{item.itemType}</h4>
                                            <p className="text-gray-500 text-[10px] uppercase font-bold">{item.bin}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievement Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
                        <Award size={140} />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 backdrop-blur-md w-fit p-1.5 rounded-lg mb-4 text-[10px] font-black uppercase tracking-widest">
                            {recycledCount > 5 ? 'Elite Milestone' : 'New Milestone'}
                        </div>
                        <h3 className="text-2xl font-black mb-1">
                            {recycledCount > 5 ? 'Waste Warrior' : 'Plastic Pioneer'}
                        </h3>
                        <p className="text-indigo-100/70 text-sm mb-6 max-w-[200px]">
                            {recycledCount > 0
                                ? `You've identified ${recycledCount} recyclable items! Every bit helps save our oceans.`
                                : "Start scanning to earn your first sustainability badge."}
                        </p>
                        <button
                            onClick={() => setShowBadgeDetails(true)}
                            className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-transform"
                        >
                            View Badge
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Learning Center */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                        <BookOpen size={14} className="text-emerald-500" />
                        Eco-Library
                    </h3>

                    <ArticleCard
                        title="The Myth of Biodegradable Plastic"
                        readTime="4 min read"
                        category="Education"
                        image="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=200"
                        onClick={() => setSelectedArticle("The Myth of Biodegradable Plastic")}
                    />

                    <ArticleCard
                        title="Mastering Home Composting"
                        readTime="6 min read"
                        category="DIY Guide"
                        image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200"
                        onClick={() => setSelectedArticle("Mastering Home Composting")}
                    />
                </div>

            </div>

            {/* Article Modal */}
            <AnimatePresence>
                {selectedArticle && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedArticle(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-[#1a1f2e]/95 backdrop-blur-2xl w-[92%] sm:w-full max-w-lg rounded-[2.5rem] overflow-hidden relative border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] z-[110]"
                        >
                            {/* Image Header - Fixed height */}
                            <div className="h-40 sm:h-48 overflow-hidden relative shrink-0">
                                <img src={ARTICLE_CONTENT[selectedArticle].image} alt={selectedArticle} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e] to-transparent opacity-60" />
                                <button
                                    onClick={() => setSelectedArticle(null)}
                                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-md transition-all z-20"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            {/* Scrollable Content */}
                            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Sustainability Series</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight tracking-tight">{selectedArticle}</h3>

                                <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap space-y-6 font-medium">
                                    {ARTICLE_CONTENT[selectedArticle].content}
                                </div>

                                {/* Bottom Action Button - Inside scroll but with significant bottom margin */}
                                <button
                                    onClick={() => setSelectedArticle(null)}
                                    className="w-full bg-emerald-500 text-white mt-12 mb-8 py-5 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest active:scale-95 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.25)] hover:bg-emerald-400 hover:-translate-y-0.5"
                                >
                                    Finish Reading
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Badge Detail Overlay */}
            <AnimatePresence>
                {showBadgeDetails && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBadgeDetails(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-8 w-full max-w-sm text-center relative z-10 border-white/10"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)]">
                                <Award size={48} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">
                                {recycledCount > 5 ? 'Waste Warrior' : 'Plastic Pioneer'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-bold">Verified Achievement</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-gray-500 uppercase">Detection Streak</span>
                                    <span className="text-emerald-400">{history.length} Scans</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-gray-500 uppercase">Global Impact</span>
                                    <span className="text-indigo-400">Top 5%</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowBadgeDetails(false)}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                            >
                                Continue Mission
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

function ArticleCard({ title, readTime, category, image, onClick }) {
    return (
        <div
            onClick={onClick}
            className="glass-card p-3 flex gap-4 items-center group cursor-pointer hover:bg-white/10 transition-colors border-white/5"
        >
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1 block">{category}</span>
                <h4 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-emerald-400 transition-colors">{title}</h4>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                    <span className="flex items-center gap-1">
                        <Zap size={10} />
                        {readTime}
                    </span>
                    <span className="flex items-center gap-1">
                        <ChevronRight size={10} />
                        Learn More
                    </span>
                </div>
            </div>
        </div>
    );
}

export default InsightsScreen;
