import React, { useState } from 'react';
import { Zap, Shield, Battery, Gauge, Wind, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Cab } from '../types/index.ts';

interface FleetViewProps {
  cabs: Cab[];
  onSelectCabForBooking: (cab: Cab) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({ cabs, onSelectCabForBooking }) => {
  const [selectedCab, setSelectedCab] = useState<Cab>(cabs[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 fill-[#ccff00]" />
          Next-Gen Autonomous & MagLev Fleet
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Engineered for Pure Comfort.
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-3">
          Explore the RideNow / yourgaadi.com fleet featuring active anti-gravity dampening, soundproof stasis pods, and biometric temperature regulation.
        </p>
      </div>

      {/* Featured Vehicle Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d1118] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="lg:col-span-6 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
            {selectedCab.plateNumber} • Tier: {selectedCab.category.toUpperCase()}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            {selectedCab.name}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">{selectedCab.tagline}</p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#141923] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#ccff00]" /> Acceleration
              </span>
              <p className="text-sm sm:text-base font-black text-white mt-1">
                {selectedCab.acceleration}
              </p>
            </div>

            <div className="bg-[#141923] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#38bdf8]" /> Armor & Safety
              </span>
              <p className="text-sm sm:text-base font-black text-white mt-1">
                {selectedCab.securityLevel}
              </p>
            </div>

            <div className="bg-[#141923] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Cabin Capacity
              </span>
              <p className="text-sm sm:text-base font-black text-white mt-1">
                {selectedCab.capacity} Passengers
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
              <span>Anti-Gravity dynamic road isolation with zero vibration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
              <span>In-cabin chilled beverage dispenser & rapid charging dock</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
              <span>Biometric HEPA-14 active air purification</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectCabForBooking(selectedCab)}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2 text-sm shadow-xl shadow-[#ccff00]/20 transition-all cursor-pointer"
            >
              Book This Model Now
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <div className="text-xs text-gray-400 font-mono">
              From <span className="text-lg font-bold text-white">${selectedCab.baseFare}</span> base
            </div>
          </div>
        </div>

        {/* Vehicle Image Container */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-t from-black via-[#0d121b] to-transparent p-2 border border-white/10 flex items-center justify-center relative">
            <div className="relative w-full h-full overflow-hidden rounded-2xl flex items-center justify-center">
              <img
                src="/assets/aistudio/Screenshot__416__c8f619f8.png"
                alt={selectedCab.name}
                className="w-full h-full object-cover object-[73%_52%] scale-[1.95] transform brightness-105 contrast-110 transition-transform duration-700 hover:scale-[2.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d121b] via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of all 4 models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cabs.map((cab) => {
          const isSelected = cab.id === selectedCab.id;
          return (
            <div
              key={cab.id}
              onClick={() => setSelectedCab(cab)}
              className={`p-5 rounded-3xl cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-[#141a24] border-[#ccff00] ring-1 ring-[#ccff00]'
                  : 'bg-[#0e1219] border-white/10 hover:border-white/20 hover:bg-[#121620]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-gray-300">
                  {cab.category}
                </span>
                <span className="text-xs font-bold text-[#ccff00]">{cab.etaMinutes} min away</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 font-heading">{cab.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-4">{cab.tagline}</p>

              <div className="space-y-1.5 text-xs text-gray-300 border-t border-white/5 pt-3 mb-4 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">0-100 km/h:</span>
                  <span>{cab.acceleration.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Security:</span>
                  <span className="text-xs">{cab.securityLevel}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCabForBooking(cab);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#ccff00] hover:text-black text-gray-200 text-xs font-bold transition-colors text-center"
              >
                Select & Book
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
