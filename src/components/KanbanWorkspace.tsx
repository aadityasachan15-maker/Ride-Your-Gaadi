import React, { useState } from 'react';
import {
  KanbanColumn,
  RideBooking,
  RideStatus,
  VehicleCategory,
} from '../types/index.ts';
import {
  Car,
  Clock,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  Users,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface KanbanWorkspaceProps {
  rides: RideBooking[];
  onUpdateRideStatus: (rideId: string, newStatus: RideStatus) => void;
  onSelectRideToTrack: (ride: RideBooking) => void;
}

const COLUMNS: { id: RideStatus; title: string; color: string; badge: string }[] = [
  { id: 'requested', title: 'Pending Dispatch', color: 'border-amber-400/40 text-amber-400', badge: 'bg-amber-400/10 text-amber-400' },
  { id: 'driver_arriving', title: 'Driver Dispatched', color: 'border-[#38bdf8]/40 text-[#38bdf8]', badge: 'bg-[#38bdf8]/10 text-[#38bdf8]' },
  { id: 'in_transit', title: 'Active In Transit', color: 'border-[#ccff00]/40 text-[#ccff00]', badge: 'bg-[#ccff00]/10 text-[#ccff00]' },
  { id: 'completed', title: 'Completed & Settled', color: 'border-emerald-400/40 text-emerald-400', badge: 'bg-emerald-400/10 text-emerald-400' },
];

export const KanbanWorkspace: React.FC<KanbanWorkspaceProps> = ({
  rides,
  onUpdateRideStatus,
  onSelectRideToTrack,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredRides = rides.filter((ride) => {
    if (filterCategory === 'all') return true;
    return ride.cab?.category === filterCategory;
  });

  const getNextStatus = (current: RideStatus): RideStatus | null => {
    switch (current) {
      case 'requested':
        return 'driver_arriving';
      case 'driver_arriving':
      case 'assigned':
        return 'in_transit';
      case 'in_transit':
        return 'completed';
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Kanban Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0e1219] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#ccff00] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            Transportation Operations & Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
            Fleet Dispatch Kanban
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Live queue management of customer bookings, driver assignments, and active transit pipelines.
          </p>
        </div>

        {/* Filter by Category */}
        <div className="flex items-center gap-2 bg-[#141923] p-1 rounded-2xl border border-white/5">
          <span className="text-xs text-gray-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'cybersedan', 'ecovolt', 'stealthsuv', 'hyperglide'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs capitalize font-bold px-3 py-1.5 rounded-xl transition-colors ${
                filterCategory === cat
                  ? 'bg-[#ccff00] text-black shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colRides = filteredRides.filter((r) => {
            if (col.id === 'driver_arriving') {
              return r.status === 'driver_arriving' || r.status === 'assigned';
            }
            return r.status === col.id;
          });

          return (
            <div
              key={col.id}
              className="bg-[#0b0e14] border border-white/10 rounded-3xl p-4 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {colRides.length}
                </span>
              </div>

              {/* Ride Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colRides.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-xs text-gray-500">No active trips in this phase</p>
                  </div>
                ) : (
                  colRides.map((ride) => {
                    const next = getNextStatus(ride.status);
                    return (
                      <div
                        key={ride.id}
                        className="bg-[#121721] hover:bg-[#161d2a] border border-white/5 hover:border-white/20 rounded-2xl p-4 transition-all shadow-md group relative"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[11px] font-mono text-[#ccff00] font-bold">
                            #{ride.id}
                          </span>
                          <span className="text-xs font-extrabold text-white font-mono">
                            ${ride.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-white mb-2">{ride.userName}</p>

                        <div className="space-y-1 text-[11px] text-gray-400 mb-3">
                          <p className="truncate">
                            <span className="text-[#ccff00]">From:</span> {ride.pickup}
                          </p>
                          <p className="truncate">
                            <span className="text-[#38bdf8]">To:</span> {ride.destination}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-400 bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5 mb-3">
                          <span>{ride.cab?.name || 'Cab'}</span>
                          <span className="font-mono text-gray-300">
                            {ride.cab?.plateNumber || 'EV-2049'}
                          </span>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => onSelectRideToTrack(ride)}
                            className="text-[11px] font-bold text-gray-300 hover:text-white"
                          >
                            Track Live HUD
                          </button>

                          {next && (
                            <button
                              type="button"
                              onClick={() => onUpdateRideStatus(ride.id, next)}
                              className="text-[11px] font-extrabold bg-[#ccff00]/15 hover:bg-[#ccff00] text-[#ccff00] hover:text-black px-2.5 py-1 rounded-lg border border-[#ccff00]/30 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              Advance <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
