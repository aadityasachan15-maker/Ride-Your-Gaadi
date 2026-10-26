import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  Shield,
  AlertTriangle,
  Car,
  Clock,
  Compass,
  Zap,
  Coffee,
  CheckCircle2,
  Navigation,
  Share2,
  Star,
  Plus,
} from 'lucide-react';
import { RideBooking, RefreshmentItem } from '../types/index.ts';
import { REFRESHMENT_ITEMS } from '../data/mockData.ts';

interface LiveTrackingViewProps {
  ride: RideBooking;
  onUpdateRide: (updated: RideBooking) => void;
  onNewBooking: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  ride,
  onUpdateRide,
  onNewBooking,
}) => {
  const [progress, setProgress] = useState(ride.currentProgressPercent || 15);
  const [speed, setSpeed] = useState(54);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(ride.rating || null);
  const [feedback, setFeedback] = useState(ride.feedback || '');
  const [refreshmentSuccess, setRefreshmentSuccess] = useState('');

  // Keep progress and rating in sync if ride changes
  useEffect(() => {
    setProgress(ride.currentProgressPercent || 0);
    setUserRating(ride.rating || null);
    setFeedback(ride.feedback || '');
  }, [ride.id, ride.currentProgressPercent, ride.rating, ride.feedback]);

  // Live simulation tick
  useEffect(() => {
    if (progress >= 100 || ride.status === 'completed') return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 2));
      setSpeed(48 + Math.floor(Math.random() * 16));
    }, 2500);

    return () => clearInterval(interval);
  }, [progress, ride.status]);

  // Sync ride completion cleanly in an effect, outside render/updater
  useEffect(() => {
    if (progress >= 100 && ride.status !== 'completed') {
      onUpdateRide({
        ...ride,
        currentProgressPercent: 100,
        status: 'completed',
        speedKmh: 0,
      });
    }
  }, [progress, ride, onUpdateRide]);

  const handleInstantArrival = () => {
    setProgress(100);
    setSpeed(0);
    onUpdateRide({
      ...ride,
      currentProgressPercent: 100,
      status: 'completed',
      speedKmh: 0,
    });
  };

  const handleAddInRideRefreshment = (item: RefreshmentItem) => {
    const existing = ride.refreshments.find((r) => r.item.id === item.id);
    let updatedRefreshments;
    if (existing) {
      updatedRefreshments = ride.refreshments.map((r) =>
        r.item.id === item.id ? { ...r, quantity: r.quantity + 1 } : r
      );
    } else {
      updatedRefreshments = [...ride.refreshments, { item, quantity: 1 }];
    }

    const updated = {
      ...ride,
      refreshments: updatedRefreshments,
      totalPrice: Math.round((ride.totalPrice + item.price) * 100) / 100,
    };
    onUpdateRide(updated);
    setRefreshmentSuccess(`Added ${item.name}! Driver notified.`);
    setTimeout(() => setRefreshmentSuccess(''), 3000);
  };

  const handleSaveRating = (stars: number) => {
    setUserRating(stars);
    onUpdateRide({
      ...ride,
      rating: stars,
      feedback: feedback || 'Great comfortable ride!',
    });
  };

  const distanceRemaining = Math.max(0, Math.round(((100 - progress) / 100) * ride.distanceKm * 10) / 10);
  const timeRemaining = Math.max(1, Math.round(((100 - progress) / 100) * ride.durationMinutes));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center text-[#ccff00]">
            <Car className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded-full border border-[#ccff00]/30">
                {progress >= 100 ? 'Ride Completed' : progress > 30 ? 'In Transit' : 'Driver Arriving'}
              </span>
              <span className="text-xs text-gray-400 font-mono">Trip #{ride.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              {progress >= 100
                ? 'Arrived Safely at Destination'
                : `Heading to ${ride.destination}`}
            </h1>
          </div>
        </div>

        {/* Action button to test completion quickly */}
        {progress < 100 && (
          <button
            type="button"
            onClick={handleInstantArrival}
            className="text-xs bg-[#19212e] hover:bg-white/10 text-gray-300 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
          >
            Fast-Forward ➔ Destination
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive GPS & Telemetry HUD */}
        <div className="lg:col-span-8 space-y-6">
          {/* Animated GPS Map */}
          <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-[#090b0e] border border-white/10 overflow-hidden shadow-2xl">
            {/* Cyber Grid */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Glowing Map polyline */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="liveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ccff00" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <path
                d="M 80,260 C 200,220 280,140 480,180 S 680,100 800,80"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <path
                d="M 80,260 C 200,220 280,140 480,180 S 680,100 800,80"
                fill="none"
                stroke="url(#liveGradient)"
                strokeWidth="6"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (1000 * progress) / 100}
                className="transition-all duration-1000"
              />
            </svg>

            {/* Moving Car Indicator */}
            <div
              className="absolute z-20 transition-all duration-1000"
              style={{
                left: `${10 + progress * 0.78}%`,
                top: `${65 - Math.sin((progress / 100) * Math.PI) * 35}%`,
              }}
            >
              <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 rounded-full bg-[#ccff00]/30 animate-ping absolute" />
                <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center shadow-xl shadow-[#ccff00]/60 z-10 font-bold">
                  <Car className="w-5 h-5 fill-black stroke-black" />
                </div>
              </div>
            </div>

            {/* Route Landmarks */}
            <div className="absolute bottom-6 left-6 z-10 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
              <span className="text-gray-400">Pickup:</span>
              <p className="font-bold text-white truncate max-w-[160px] sm:max-w-xs">{ride.pickup}</p>
            </div>

            <div className="absolute top-6 right-6 z-10 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
              <span className="text-gray-400">Destination:</span>
              <p className="font-bold text-[#38bdf8] truncate max-w-[160px] sm:max-w-xs">{ride.destination}</p>
            </div>

            {/* Real-time Telemetry Overlay Bar */}
            <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3 bg-[#111622]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Speed</p>
                <p className="text-sm font-black text-[#ccff00] font-mono">
                  {progress >= 100 ? 0 : speed} km/h
                </p>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Remaining</p>
                <p className="text-sm font-black text-white font-mono">{distanceRemaining} km</p>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">ETA</p>
                <p className="text-sm font-black text-[#38bdf8] font-mono">
                  {progress >= 100 ? '0m' : `${timeRemaining} mins`}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-[#0e1219] border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Journey Progress</span>
              <span className="font-bold text-[#ccff00] font-mono">{progress}% Complete</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#ccff00] to-[#38bdf8] rounded-full transition-all duration-700 shadow-sm shadow-[#ccff00]/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* In-Ride Refreshments On-The-Go (Prompt requirement) */}
          <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#ccff00]" />
                Order In-Transit Refreshments
              </h3>
              <span className="text-[11px] text-[#ccff00] font-bold">Driver Serves to Seat</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Thirsty during your trip? Add a chilled beverage or snack anytime during the ride.
            </p>

            {refreshmentSuccess && (
              <div className="mb-3 text-xs bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] px-3.5 py-2 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {refreshmentSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REFRESHMENT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#141923] border border-white/5"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[11px] text-[#ccff00] font-mono font-bold">
                      {item.price === 0 ? 'Complimentary' : `$${item.price.toFixed(2)}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddInRideRefreshment(item)}
                    className="flex items-center gap-1 bg-[#1b2332] hover:bg-[#ccff00] hover:text-black text-gray-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Driver & Security & Completion Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Driver Card */}
          <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
              <img
                src={ride.cab.driverPhoto}
                alt={ride.cab.driverName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#ccff00]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{ride.cab.driverName}</h3>
                  <span className="text-xs font-bold text-black bg-[#ccff00] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black stroke-black" /> {ride.cab.driverRating}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {ride.cab.driverTotalTrips.toLocaleString()} verified trips
                </p>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-gray-300 bg-white/5 px-2 py-0.5 rounded">
                  <Shield className="w-3 h-3 text-[#38bdf8]" />
                  {ride.cab.securityLevel}
                </div>
              </div>
            </div>

            {/* Vehicle info */}
            <div className="py-4 border-b border-white/10">
              <p className="text-[11px] text-gray-400 uppercase font-semibold">Assigned Gaadi</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-white">{ride.cab.name}</span>
                <span className="text-xs font-bold font-mono bg-[#141923] border border-white/10 px-2.5 py-1 rounded-lg text-[#ccff00]">
                  {ride.cab.plateNumber}
                </span>
              </div>
            </div>

            {/* Communication & SOS buttons */}
            <div className="pt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => alert(`Calling driver ${ride.cab.driverName} at ${ride.cab.driverPhone}`)}
                className="flex items-center justify-center gap-2 bg-[#141923] hover:bg-white/10 text-gray-200 border border-white/10 py-2.5 rounded-2xl text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#ccff00]" /> Call Driver
              </button>
              <button
                type="button"
                onClick={() => alert(`Opening encrypted in-app chat with ${ride.cab.driverName}`)}
                className="flex items-center justify-center gap-2 bg-[#141923] hover:bg-white/10 text-gray-200 border border-white/10 py-2.5 rounded-2xl text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" /> Message
              </button>
            </div>

            {/* SOS Emergency button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setSosTriggered(!sosTriggered)}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  sosTriggered
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                {sosTriggered ? 'SOS Active • Live Ops Contacted' : 'Titanium Emergency SOS'}
              </button>
            </div>
          </div>

          {/* Completion & Receipt Card when arrived */}
          {progress >= 100 && (
            <div className="bg-gradient-to-br from-[#131c17] to-[#0e1219] border border-[#ccff00]/40 rounded-3xl p-5 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">Trip Settled & Paid</h3>
              <p className="text-xs text-gray-300 mt-1 mb-4">
                Paid automatically via {ride.paymentMethod === 'wallet' ? 'RidePay Balance' : 'Card'}. Sarah arrived on time!
              </p>

              {/* Rate Driver */}
              <div className="mb-4 pt-3 border-t border-white/10">
                <p className="text-xs font-semibold text-gray-300 mb-2">Rate your driver:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleSaveRating(star)}
                      className={`p-1.5 rounded-lg ${
                        (userRating || 5) >= star ? 'text-[#ccff00]' : 'text-gray-600'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300 font-mono py-2 border-y border-white/10 mb-4">
                <div className="flex justify-between">
                  <span className="font-sans text-gray-400">Total Billed</span>
                  <span className="text-[#ccff00] font-bold">${ride.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-gray-400">Status</span>
                  <span className="text-emerald-400 font-bold uppercase">PAID</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onNewBooking}
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-[#ccff00]/20 transition-all cursor-pointer"
              >
                Book Another Gaadi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
