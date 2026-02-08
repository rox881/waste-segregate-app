import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Droplets, Zap, Wind } from 'lucide-react';

const ImpactDashboard = ({ history, wasteKnowledge }) => {
    // Calculate totals from history
    const totals = useMemo(() => {
        return history.reduce((acc, item) => {
            const itemLower = item?.itemType?.toLowerCase() || '';
            const knowledge = Object.entries(wasteKnowledge).find(([key]) =>
                itemLower.includes(key.toLowerCase())
            )?.[1];

            const impact = knowledge?.numericalImpact || { co2: 0, water: 0, energy: 0 };

            return {
                co2: acc.co2 + impact.co2,
                water: acc.water + impact.water,
                energy: acc.energy + impact.energy
            };
        }, { co2: 0, water: 0, energy: 0 });
    }, [history, wasteKnowledge]);

    // Comparison helpers
    const facts = {
        co2: (totals.co2 / 1000).toFixed(1), // kg
        water: (totals.water / 150000).toFixed(1), // 150L per bathtub
        energy: (totals.energy / 50).toFixed(1) // 50Wh per hour of laptop use
    };

    if (history.length === 0) return null;

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-2 left-0 right-0 z-[60] px-3 pointer-events-none"
        >
            <div className="max-w-md mx-auto pointer-events-auto">
                <div className="glass-card bg-[#0d1526]/80 border-emerald-500/20 backdrop-blur-3xl p-2 px-4 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] border flex items-center justify-between gap-3 overflow-hidden relative">

                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 pr-3 border-r border-white/5">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest hidden xs:block">LIVE</span>
                    </div>

                    <div className="flex-1 flex justify-around items-center px-1">
                        <ImpactStat
                            icon={<Wind className="text-emerald-400" size={14} />}
                            value={`${facts.co2}`}
                            unit="kg"
                            label="CO2"
                        />
                        <ImpactStat
                            icon={<Droplets className="text-blue-400" size={14} />}
                            value={`${facts.water}`}
                            unit="b"
                            label="H2O"
                        />
                        <ImpactStat
                            icon={<Zap className="text-amber-400" size={14} />}
                            value={`${facts.energy}`}
                            unit="h"
                            label="Pwr"
                        />
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Globe size={16} className="text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

function ImpactStat({ icon, value, unit, label }) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={value}
                        initial={{ scale: 1.2, color: '#fff' }}
                        animate={{ scale: 1, color: '#fff' }}
                        className="text-xs font-black"
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>
                <span className="text-[8px] font-bold text-gray-500">{unit}</span>
            </div>
            <p className="text-[7px] font-black text-emerald-500/60 uppercase tracking-tighter mt-0.5">{label}</p>
        </div>
    );
}

export default ImpactDashboard;
