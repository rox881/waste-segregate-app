import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trees,
    Zap,
    ArrowRightLeft,
    Lightbulb,
    AlertTriangle,
    ChevronRight,
    Info,
    CheckCircle2,
    Factory,
    Recycle,
    Leaf,
    Droplets,
    Trash2,
    Minimize2,
    Smartphone,
    Coffee,
    Battery,
    Cpu,
    Box,
    Shirt,
    Construction,
    Layers,
    Waves,
    Newspaper,
    MapPin,
    Navigation as NavIcon
} from 'lucide-react';

import { WASTE_KNOWLEDGE, DEFAULT_KNOWLEDGE } from '../data/wasteData';
import DropOffFinder from './DropOffFinder';

const ItemDetailScreen = ({ item }) => {
    const [knowledgeImgError, setKnowledgeImgError] = useState(false);
    const [transformedImgError, setTransformedImgError] = useState(false);
    const [isLocatorOpen, setIsLocatorOpen] = useState(false);

    // 1. Try to use AI-generated metadata first
    const aiData = item?.metadata || {};

    // Determine colors and icons based on Bin
    const binType = item?.bin || 'Landfill';
    const theme =
        binType === 'Recycle' ? {
            primary: 'emerald',
            gradient: 'from-emerald-500 to-teal-600',
            glow: 'shadow-emerald-500/20',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20',
            icon: <Recycle size={32} />
        } :
            binType === 'Organic' ? {
                primary: 'amber',
                gradient: 'from-amber-500 to-orange-600',
                glow: 'shadow-amber-500/20',
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                border: 'border-amber-500/20',
                icon: <Leaf size={32} />
            } :
                binType === 'Hazardous' ? {
                    primary: 'red',
                    gradient: 'from-red-500 to-rose-600',
                    glow: 'shadow-red-500/20',
                    bg: 'bg-red-500/10',
                    text: 'text-red-400',
                    border: 'border-red-500/20',
                    icon: <AlertTriangle size={32} />
                } :
                    {
                        primary: 'slate',
                        gradient: 'from-slate-500 to-slate-700',
                        glow: 'shadow-slate-500/20',
                        bg: 'bg-slate-500/10',
                        text: 'text-slate-400',
                        border: 'border-slate-500/20',
                        icon: <ArrowRightLeft size={32} />
                    };

    // 2. Intelligent fallback logic
    const itemLower = item?.itemType?.toLowerCase() || '';

    // Find best match in knowledge base
    const knowledgeMatch = Object.entries(WASTE_KNOWLEDGE)
        .sort((a, b) => b[0].length - a[0].length) // Specific items first
        .find(([key]) => {
            const k = key.toLowerCase();
            return itemLower.includes(k) || (itemLower.length > 3 && k.includes(itemLower));
        })?.[1];

    // Final fallback based on bin category
    const categoryFallback = DEFAULT_KNOWLEDGE[binType] || DEFAULT_KNOWLEDGE['Landfill'];

    // 3. Fallback Icon Logic
    const getFallbackIcon = (name, categoryIcon) => {
        const n = name.toLowerCase();
        if (n.includes('phone') || n.includes('mobile') || n.includes('smart')) return <Smartphone size={32} />;
        if (n.includes('laptop') || n.includes('comp') || n.includes('tech')) return <Cpu size={32} />;
        if (n.includes('cup') || n.includes('coffee') || n.includes('mug') || n.includes('drink')) return <Coffee size={32} />;
        if (n.includes('batt')) return <Battery size={32} />;
        if (n.includes('bottle') || n.includes('liquid') || n.includes('water')) return <Droplets size={32} />;
        if (n.includes('book') || n.includes('mag') || n.includes('paper') || n.includes('news')) return <Newspaper size={32} />;
        if (n.includes('tin') || n.includes('can') || n.includes('metal')) return <Box size={32} />;
        if (n.includes('pizza') || n.includes('box') || n.includes('styro') || n.includes('bag')) return <Box size={32} />;
        if (n.includes('egg') || n.includes('food') || n.includes('org') || n.includes('fruit') || n.includes('veg')) return <Leaf size={32} />;
        if (n.includes('glass') || n.includes('jar') || n.includes('vase')) return <Droplets size={32} />;
        return categoryIcon;
    };

    const getSecondaryFallbackIcon = (transformationText) => {
        const t = transformationText?.toLowerCase() || '';
        if (t.includes('apparel') || t.includes('fiber') || t.includes('shirt')) return <Shirt size={32} />;
        if (t.includes('tile') || t.includes('construction') || t.includes('building')) return <Construction size={32} />;
        if (t.includes('soil') || t.includes('compost') || t.includes('fertilizer')) return <Layers size={32} />;
        if (t.includes('mineral') || t.includes('metal') || t.includes('gold')) return <Zap size={32} />;
        if (t.includes('energy') || t.includes('electricity') || t.includes('power')) return <Lightbulb size={32} />;
        if (t.includes('paper') || t.includes('cardboard')) return <Newspaper size={32} />;
        if (t.includes('lumber') || t.includes('bench')) return <Construction size={32} />;
        return <Zap size={32} />;
    };

    const displayData = {
        title: item?.itemType || "Unknown Material",
        badge: binType === 'Recycle' ? 'Recyclable' : binType === 'Organic' ? 'Compostable' : binType === 'Hazardous' ? 'Toxic/Hazard' : 'Landfill',
        description: aiData.fun_fact || knowledgeMatch?.fun_fact || categoryFallback.fun_fact,
        transformation: aiData.transformation || knowledgeMatch?.transformation || categoryFallback.transformation,
        impact: aiData.impact || knowledgeMatch?.impact || categoryFallback.impact,
        tips: knowledgeMatch?.tips || categoryFallback.tips || [],
        isContaminated: item?.contaminated,
        capturedImage: item?.capturedImage,
        knowledgeImage: knowledgeMatch?.image,
        transformedImage: knowledgeMatch?.transformedImage,
        fallbackPrimaryIcon: getFallbackIcon(item?.itemType || '', theme.icon),
        fallbackSecondaryIcon: getSecondaryFallbackIcon(aiData.transformation || knowledgeMatch?.transformation || categoryFallback.transformation)
    };

    return (
        <div className="min-h-full pb-32">
            {/* Premium Hero Header with Image */}
            <div className="relative h-72 sm:h-80 overflow-hidden flex flex-col items-center justify-end pb-8">
                {/* Background Image / Gradient */}
                {displayData.capturedImage ? (
                    <div className="absolute inset-0">
                        <img src={displayData.capturedImage} alt="Scanned Item" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-black/40 to-transparent" />
                    </div>
                ) : (
                    <>
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-20`} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(10,15,30,1)_100%)]" />
                    </>
                )}

                {/* Overlaid Badge & Title */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="z-10 text-center px-6"
                >
                    <div className="flex justify-center mb-4">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className={`w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center ${theme.text} shadow-2xl`}
                        >
                            {theme.icon}
                        </motion.div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border ${theme.border} ${theme.bg} ${theme.text} backdrop-blur-md`}>
                        {displayData.badge}
                    </span>
                    <h1 className="text-4xl font-black text-white mt-4 tracking-tighter drop-shadow-2xl">
                        {displayData.title}
                    </h1>
                </motion.div>
            </div>

            {/* Content Body */}
            <div className="px-6 -mt-4 relative z-20 space-y-6">

                {/* Contamination Alert */}
                {displayData.isContaminated && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="glass-card p-4 border-red-500/30 bg-red-500/5 flex items-start gap-4"
                    >
                        <div className="p-2 bg-red-500/20 rounded-xl text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h4 className="text-red-400 font-bold text-sm">Contamination Warning</h4>
                            <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">This item contains organic residue. Please rinse thoroughly to avoid contaminating the recycling stream.</p>
                        </div>
                    </motion.div>
                )}

                {/* How to Dispose - Three Box Layout */}
                <div className="space-y-4">
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-400 px-2">How to Dispose</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <DisposalTask
                            icon={<Droplets size={24} />}
                            step="1. Rinse"
                            label="CLEAN"
                            active={displayData.isContaminated || binType === 'Recycle'}
                        />
                        <DisposalTask
                            icon={<Minimize2 size={24} />}
                            step="2. Crush"
                            label="SPACE"
                            active={binType === 'Recycle'}
                        />
                        <DisposalTask
                            icon={<Trash2 size={24} />}
                            step={`3. Bin`}
                            label={binType.toUpperCase()}
                            highlight={theme.text}
                            active={true}
                        />
                    </div>
                </div>

                {/* THE FUTURE: What it becomes */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                            <Factory size={16} />
                        </span>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Circular Evolution</h3>
                    </div>

                    <div className="glass-card p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden bg-emerald-500/[0.02]">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

                        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 relative z-10 w-full">
                            {/* Original Item Illustration */}
                            <div className="group relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#131b27] border border-white/10 flex items-center justify-center overflow-hidden">
                                    {displayData.knowledgeImage && !knowledgeImgError ? (
                                        <img
                                            src={displayData.knowledgeImage}
                                            alt="Material"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            onError={() => setKnowledgeImgError(true)}
                                        />
                                    ) : (
                                        <div className="text-gray-500 opacity-50">
                                            {displayData.fallbackPrimaryIcon}
                                        </div>
                                    )}
                                </div>
                                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-[8px] font-black text-white px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
                                    PRIMARY
                                </span>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <ChevronRight className="text-emerald-500/40" size={24} />
                                </motion.div>
                                <span className="text-[8px] font-black text-emerald-500/40 uppercase tracking-tighter">PROCESS</span>
                            </div>

                            {/* Transformed Result */}
                            <div className="group relative">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#131b27] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden">
                                    {displayData.transformedImage && !transformedImgError ? (
                                        <img
                                            src={displayData.transformedImage}
                                            alt="Transformed"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            onError={() => setTransformedImgError(true)}
                                        />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center">
                                            {displayData.fallbackSecondaryIcon}
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2)_0%,transparent_70%)] animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                                    SECOND LIFE
                                </span>
                            </div>
                        </div>

                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2 relative z-10">Resource Rebirth</h4>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-[280px] font-bold relative z-10 italic">
                            {displayData.transformation}
                        </p>
                    </div>
                </div>

                {/* Fun Fact / Description Card */}
                <div className="glass-card p-6 border-white/5 relative overflow-hidden group bg-white/[0.02]">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Info size={80} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                            <Lightbulb size={16} />
                        </span>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Eco-Insight</h3>
                    </div>
                    <p className="text-gray-200 leading-relaxed font-semibold italic text-sm">
                        "{displayData.description}"
                    </p>
                </div>

                {/* IMPACT SHIELD */}
                <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} blur-3xl opacity-10`} />
                    <div className="glass-card p-6 border-white/10 shadow-2xl relative bg-slate-900/40">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`p-1.5 ${theme.bg} rounded-lg ${theme.text}`}>
                                <Trees size={16} />
                            </span>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Planetary Impact</h3>
                        </div>
                        <p className="text-xl font-black text-white leading-tight">
                            {displayData.impact}
                        </p>

                        {/* CTA for Drop-off */}
                        {(binType === 'Hazardous' || binType === 'Recycle' || binType === 'Organic') && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsLocatorOpen(true)}
                                className="mt-6 w-full py-4 bg-emerald-500 rounded-2xl flex items-center justify-center gap-3 text-black font-black text-xs shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                            >
                                <MapPin size={16} />
                                FIND NEAREST CENTER
                                <ChevronRight size={16} />
                            </motion.button>
                        )}
                    </div>
                </div>

                <DropOffFinder
                    isOpen={isLocatorOpen}
                    onClose={() => setIsLocatorOpen(false)}
                    filterType={binType}
                />

                {/* Smart Tips */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Expert Protocols</h3>
                    <div className="space-y-2">
                        {displayData.tips.map((tip, idx) => (
                            <TipItem key={idx} text={tip} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

function DisposalTask({ icon, step, label, highlight, active }) {
    return (
        <div className={`glass-card p-4 flex flex-col items-center gap-3 border-white/5 transition-all text-center
            ${active ? 'opacity-100 border-white/10 bg-white/5' : 'opacity-30 grayscale'}
        `}>
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${highlight || 'text-white'}`}>
                {icon}
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black text-white whitespace-nowrap">{step}</p>
                <p className={`text-[8px] font-black uppercase tracking-widest ${highlight || 'text-gray-500'}`}>{label}</p>
            </div>
        </div>
    );
}

function TipItem({ text }) {
    return (
        <div className="glass-card p-4 py-3 flex items-center gap-3 border-white/5 hover:bg-white/10 transition-colors bg-white/[0.01]">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="text-gray-400 text-xs font-bold leading-relaxed">{text}</span>
        </div>
    );
}

export default ItemDetailScreen;
