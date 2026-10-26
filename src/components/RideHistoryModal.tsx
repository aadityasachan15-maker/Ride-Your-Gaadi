import React from 'react';
import { X, Clock, MapPin, Navigation, Star, RotateCcw, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { RideBooking } from '../types/index.ts';

interface RideHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rides: RideBooking[];
  onRebook: (ride: RideBooking) => void;
}

export const RideHistoryModal: React.FC<RideHistoryModalProps> = ({
  isOpen,
  onClose,
  rides,
  onRebook,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f131a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              Ride History & Tax Receipts
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Review past journeys, downloaded invoices, and Sarah's on-time airport trip.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of rides */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {rides.map((ride) => {
            const isSarahUrgentDemo = ride.id === 'RN-84920';

            return (
              <div
                key={ride.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSarahUrgentDemo
                    ? 'bg-gradient-to-r from-[#17202d] to-[#12161f] border-[#ccff00]/40 shadow-lg'
                    : 'bg-[#141923] border-white/5'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#ccff00]">#{ride.id}</span>
                    {isSarahUrgentDemo && (
                      <span className="text-[10px] bg-[#ccff00] text-black font-extrabold px-2 py-0.5 rounded-full">
                        SARAH'S ON-TIME AIRPORT TRIP
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-extrabold text-white font-mono">
                    ${ride.totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
                    <span className="truncate">{ride.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span className="truncate font-medium text-white">{ride.destination}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-3 text-gray-400">
                    <span>{ride.cab?.name || 'CyberSedan'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {ride.rating || 5} / 5
                    </span>
                    {ride.promoCode && (
                      <span className="text-[#ccff00] bg-[#ccff00]/10 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        {ride.promoCode} (-${ride.discountApplied.toFixed(2)})
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onRebook(ride);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rebook Trip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
