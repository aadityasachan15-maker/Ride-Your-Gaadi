import React, { useState, useEffect } from 'react';
import {
  Power,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Navigation,
  Car,
  Bell,
  Star,
} from 'lucide-react';
import { RideBooking } from '../types/index.ts';

interface DriverPortalProps {
  onAcceptIncomingTrip?: (trip: any) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ onAcceptIncomingTrip }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState(284.5);
  const [completedTrips, setCompletedTrips] = useState(8);
  const [incomingRequest, setIncomingRequest] = useState<any | null>(null);
  const [timerCountdown, setTimerCountdown] = useState(15);
  const [acceptedMessage, setAcceptedMessage] = useState('');

  // Periodically generate a simulated ride request when driver is online
  useEffect(() => {
    if (!isOnline) {
      setIncomingRequest(null);
      return;
    }

    const timeout = setTimeout(() => {
      setIncomingRequest({
        id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
        riderName: 'Sarah Jenkins',
        pickup: 'Downtown Tech Park, Tower B',
        destination: 'International Airport (Terminal 3)',
        distanceKm: 18.5,
        estimatedDurationMins: 22,
        estimatedFare: 42.5,
        riderRating: 5.0,
        urgency: 'Flight Departure in 1h 45m',
      });
      setTimerCountdown(15);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [isOnline, completedTrips]);

  // Request countdown timer
  useEffect(() => {
    if (!incomingRequest) return;
    if (timerCountdown <= 0) {
      setIncomingRequest(null);
      return;
    }

    const timer = setInterval(() => {
      setTimerCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingRequest, timerCountdown]);

  const handleAccept = () => {
    if (!incomingRequest) return;
    setAcceptedMessage(`Accepted ride for ${incomingRequest.riderName}! Navigating to pickup.`);
    setEarnings((prev) => prev + incomingRequest.estimatedFare);
    setCompletedTrips((prev) => prev + 1);
    setIncomingRequest(null);
    setTimeout(() => setAcceptedMessage(''), 4000);
  };

  const handleDecline = () => {
    setIncomingRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Driver Header & Online Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0e1219] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#17202d] to-[#12161f] border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00]">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                Driver Partner Console
              </h1>
              <span className="text-xs bg-[#ccff00]/10 text-[#ccff00] font-mono px-2 py-0.5 rounded border border-[#ccff00]/20">
                CyberSedan #DL-01-EV-2049
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Active Area: Central Business District & Airport Corridor
            </p>
          </div>
        </div>

        {/* Big Online/Offline Switch */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-lg ${
            isOnline
              ? 'bg-[#ccff00] text-black shadow-[#ccff00]/30 hover:bg-[#b8e600]'
              : 'bg-[#1b2230] text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <Power className={`w-4 h-4 ${isOnline ? 'stroke-[3]' : ''}`} />
          {isOnline ? 'ONLINE & ACCEPTING TRIPS' : 'OFFLINE (TAP TO GO ONLINE)'}
        </button>
      </div>

      {acceptedMessage && (
        <div className="bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00] p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          {acceptedMessage}
        </div>
      )}

      {/* Incoming Request Alert Modal / Banner */}
      {incomingRequest && (
        <div className="bg-gradient-to-r from-[#17231c] via-[#101924] to-[#131620] border-2 border-[#ccff00] rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-top-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#ccff00] animate-ping" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#ccff00] bg-[#ccff00]/20 px-3 py-1 rounded-full">
                New Ride Dispatch Request
              </span>
              <span className="text-xs text-gray-300 font-mono">
                Expires in {timerCountdown}s
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400">Guaranteed Payout</span>
              <p className="text-2xl font-black text-[#ccff00] font-heading">
                ${incomingRequest.estimatedFare.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 mb-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Rider</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{incomingRequest.riderName}</span>
                <span className="text-xs text-[#ccff00] flex items-center gap-1 font-bold">
                  <Star className="w-3 h-3 fill-[#ccff00]" /> {incomingRequest.riderRating}
                </span>
              </div>
              <span className="inline-block mt-1 text-[11px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                ⚡ {incomingRequest.urgency}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-[#ccff00]" />
                <span className="truncate">{incomingRequest.pickup}</span>
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Navigation className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="truncate">{incomingRequest.destination}</span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono pl-5">
                {incomingRequest.distanceKm} km • ~{incomingRequest.estimatedDurationMins} mins
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDecline}
              className="py-3 rounded-2xl text-xs sm:text-sm font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-black bg-[#ccff00] hover:bg-[#b8e600] shadow-lg shadow-[#ccff00]/30 transition-all cursor-pointer"
            >
              Accept Trip ({timerCountdown}s)
            </button>
          </div>
        </div>
      )}

      {/* Driver Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-gray-400 text-xs mb-2">
            <span>Today's Earnings</span>
            <DollarSign className="w-4 h-4 text-[#ccff00]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">${earnings.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">+18% vs yesterday</span>
        </div>

        <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-gray-400 text-xs mb-2">
            <span>Completed Trips</span>
            <Clock className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{completedTrips}</p>
          <span className="text-[11px] text-gray-400">100% on-time arrival</span>
        </div>

        <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-gray-400 text-xs mb-2">
            <span>Driver Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">4.97 ★</p>
          <span className="text-[11px] text-gray-400">Top 1% Titanium Fleet</span>
        </div>

        <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
          <div className="flex justify-between items-center text-gray-400 text-xs mb-2">
            <span>Acceptance Rate</span>
            <TrendingUp className="w-4 h-4 text-[#ccff00]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">98.2%</p>
          <span className="text-[11px] text-emerald-400 font-medium">Eligible for weekly bonus</span>
        </div>
      </div>

      {/* High Demand Surge Map */}
      <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-2 font-heading">
          Live City Demand & Surge Multipliers
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Navigate to high-demand zones to receive automatic dispatch priority and higher surge payouts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#141923] p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">Terminal 3 Airport Corridor</span>
              <span className="text-xs font-extrabold text-[#ccff00] bg-[#ccff00]/15 px-2 py-0.5 rounded">
                +1.6x Surge
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">High flight arrivals. 14 riders waiting.</p>
          </div>

          <div className="bg-[#141923] p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">Downtown Tech Hub</span>
              <span className="text-xs font-extrabold text-[#ccff00] bg-[#ccff00]/15 px-2 py-0.5 rounded">
                +1.3x Surge
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Peak shift departure. 8 riders waiting.</p>
          </div>

          <div className="bg-[#141923] p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">Central Railway Station</span>
              <span className="text-xs font-extrabold text-gray-300 bg-white/5 px-2 py-0.5 rounded">
                Normal (1.0x)
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Steady traffic flow. Cabs balanced.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
