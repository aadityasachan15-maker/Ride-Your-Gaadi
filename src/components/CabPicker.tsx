import React, { useState } from 'react';
import {
  Car,
  Clock,
  Users,
  Shield,
  Zap,
  Tag,
  Heart,
  Coffee,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  Sparkles,
  MapPin,
  Navigation,
  Plus,
  Minus,
} from 'lucide-react';
import { Cab, RefreshmentItem, UserProfile } from '../types/index.ts';
import { REFRESHMENT_ITEMS } from '../data/mockData.ts';
import { calculateFare, estimateRouteMetrics } from '../utils/fareCalculator.ts';

interface CabPickerProps {
  pickup: string;
  destination: string;
  cabs: Cab[];
  currentUser: UserProfile | null;
  onBack: () => void;
  onConfirmBooking: (bookingData: {
    cab: Cab;
    pickup: string;
    destination: string;
    distanceKm: number;
    durationMinutes: number;
    promoCode?: string;
    donationAmount: number;
    refreshments: { item: RefreshmentItem; quantity: number }[];
    totalPrice: number;
    paymentMethod: 'wallet' | 'card' | 'upi' | 'cash';
  }) => void;
}

export const CabPicker: React.FC<CabPickerProps> = ({
  pickup,
  destination,
  cabs,
  currentUser,
  onBack,
  onConfirmBooking,
}) => {
  const [selectedCabId, setSelectedCabId] = useState<string>(cabs[0]?.id || 'cab_cybersedan_01');
  const [promoInput, setPromoInput] = useState('SARAH_AIRPORT');
  const [appliedPromo, setAppliedPromo] = useState('SARAH_AIRPORT');
  const [promoError, setPromoError] = useState('');
  const [carbonDonation, setCarbonDonation] = useState(true);
  const [selectedRefreshments, setSelectedRefreshments] = useState<
    { item: RefreshmentItem; quantity: number }[]
  >([
    { item: REFRESHMENT_ITEMS[0], quantity: 1 }, // Sarah's default cold drink
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'upi' | 'cash'>('wallet');

  const selectedCab = cabs.find((c) => c.id === selectedCabId) || cabs[0];
  const route = estimateRouteMetrics(pickup, destination);

  // Calculate fare breakdown
  const fareBreakdown = calculateFare({
    baseFare: selectedCab.baseFare,
    perKmRate: selectedCab.perKmRate,
    distanceKm: route.distanceKm,
    promoCode: appliedPromo,
    donationSelected: carbonDonation,
    donationAmount: 1.0,
    refreshments: selectedRefreshments,
  });

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (!clean) {
      setAppliedPromo('');
      setPromoError('');
      return;
    }
    if (clean === 'SARAH_AIRPORT' || clean === 'NEXTGEN50' || clean === 'FUTURE10' || clean === 'ECOGREEN') {
      setAppliedPromo(clean);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try SARAH_AIRPORT or NEXTGEN50');
    }
  };

  const updateRefreshmentQuantity = (item: RefreshmentItem, delta: number) => {
    setSelectedRefreshments((prev) => {
      const existing = prev.find((p) => p.item.id === item.id);
      if (!existing && delta > 0) {
        return [...prev, { item, quantity: delta }];
      }
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((p) => p.item.id !== item.id);
        }
        return prev.map((p) => (p.item.id === item.id ? { ...p, quantity: newQty } : p));
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    onConfirmBooking({
      cab: selectedCab,
      pickup,
      destination,
      distanceKm: route.distanceKm,
      durationMinutes: route.durationMinutes,
      promoCode: appliedPromo || undefined,
      donationAmount: fareBreakdown.donationAmount,
      refreshments: selectedRefreshments,
      totalPrice: fareBreakdown.finalTotal,
      paymentMethod,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Top Breadcrumb & Route Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white bg-[#141923] hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Change Route
        </button>

        <div className="flex items-center gap-3 bg-[#111621] border border-white/10 px-4 py-2 rounded-2xl text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00]" />
            <span className="font-medium truncate max-w-[130px] sm:max-w-[200px]">{pickup}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <div className="flex items-center gap-1.5 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
            <span className="font-bold truncate max-w-[130px] sm:max-w-[200px]">{destination}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 font-mono text-[#ccff00]">
            <span>{route.distanceKm} km</span>
            <span>•</span>
            <span>{route.durationMinutes} mins</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map Simulation + Available Cabs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Animated Map HUD */}
          <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-[#0d1118] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(#ccff00 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Glowing route paths */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ccff00" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 60,180 Q 200,90 320,130 T 560,70"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6,4"
                className="animate-pulse"
              />
            </svg>

            {/* Map Markers */}
            <div className="absolute top-[160px] left-[50px] flex flex-col items-center group">
              <div className="w-8 h-8 rounded-full bg-[#ccff00] text-black font-extrabold flex items-center justify-center shadow-lg shadow-[#ccff00]/50 animate-bounce">
                <MapPin className="w-5 h-5 fill-black stroke-black" />
              </div>
              <span className="text-[10px] font-bold bg-black/90 text-[#ccff00] px-2 py-0.5 rounded-full mt-1 border border-[#ccff00]/40">
                Pickup
              </span>
            </div>

            <div className="absolute top-[55px] right-[70px] flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#38bdf8] text-black font-extrabold flex items-center justify-center shadow-lg shadow-[#38bdf8]/50">
                <Navigation className="w-5 h-5 fill-black stroke-black" />
              </div>
              <span className="text-[10px] font-bold bg-black/90 text-[#38bdf8] px-2 py-0.5 rounded-full mt-1 border border-[#38bdf8]/40">
                Destination
              </span>
            </div>

            {/* Nearby moving vehicle markers */}
            {cabs.map((cab, idx) => {
              const offsets = [
                { top: '120px', left: '160px' },
                { top: '80px', left: '260px' },
                { top: '190px', left: '280px' },
                { top: '100px', left: '420px' },
              ];
              const pos = offsets[idx % offsets.length];
              const isSelected = cab.id === selectedCabId;

              return (
                <button
                  key={cab.id}
                  onClick={() => setSelectedCabId(cab.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ccff00] text-black scale-125 z-30 shadow-lg shadow-[#ccff00]/40'
                      : 'bg-[#151a24] text-gray-300 hover:text-white border border-white/10'
                  }`}
                  title={`${cab.name} (${cab.etaMinutes} mins)`}
                >
                  <Car className="w-4 h-4" />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold bg-black/90 text-white px-1.5 py-0.5 rounded border border-white/10">
                    {cab.etaMinutes}m
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-3 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-[11px] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
              <span>4 Cabs Active in Fleet Radar</span>
            </div>
          </div>

          {/* Cab Selection Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white font-heading">Choose Cab Type</h2>
              <span className="text-xs text-[#ccff00] font-semibold">Fastest pick: 2 mins</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {cabs.map((cab) => {
                const isSelected = cab.id === selectedCabId;
                const cabFare = calculateFare({
                  baseFare: cab.baseFare,
                  perKmRate: cab.perKmRate,
                  distanceKm: route.distanceKm,
                  donationSelected: false,
                  refreshments: [],
                });

                return (
                  <div
                    key={cab.id}
                    onClick={() => setSelectedCabId(cab.id)}
                    className={`relative p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#17202d] to-[#12161f] border-[#ccff00] shadow-xl shadow-[#ccff00]/10 ring-1 ring-[#ccff00]'
                        : 'bg-[#0e1219] border-white/10 hover:border-white/20 hover:bg-[#121620]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#ccff00] flex items-center justify-center text-black">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-[#ccff00]/20 text-[#ccff00]' : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{cab.name}</h3>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1 text-[#ccff00]">
                            <Clock className="w-3 h-3" /> {cab.etaMinutes} min away
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {cab.capacity} seats
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-1 mb-3">{cab.tagline}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[11px] bg-white/5 px-2 py-0.5 rounded text-gray-300 font-mono">
                        {cab.securityLevel}
                      </span>
                      <span className="text-base font-extrabold text-[#ccff00]">
                        ${cabFare.rideFare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customization, Refreshments, Promo & Payment */}
        <div className="lg:col-span-5 space-y-5">
          {/* Refreshments & Extra Comforts Section */}
          <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#ccff00]" />
                In-Ride Refreshments & Comfort
              </h3>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Chilled in Gaadi</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Pre-order chilled beverages and snacks ready waiting in your gaadi's refreshment bar.
            </p>

            <div className="space-y-2">
              {REFRESHMENT_ITEMS.map((item) => {
                const qty = selectedRefreshments.find((r) => r.item.id === item.id)?.quantity || 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#141923] border border-white/5"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[11px] text-[#ccff00] font-mono">
                          {item.price === 0 ? 'FREE' : `$${item.price.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => updateRefreshmentQuantity(item, -1)}
                        disabled={qty === 0}
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-white">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateRefreshmentQuantity(item, 1)}
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-[#ccff00] hover:bg-[#ccff00]/20 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carbon Offset Donation */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">Carbon Offset Donation</span>
                    <p className="text-[10px] text-gray-400">Contribute $1.00 to green reforestation</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={carbonDonation}
                  onChange={(e) => setCarbonDonation(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#ccff00] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Promo Code Card */}
          <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#ccff00]" />
              Discounts & Promo Codes
            </h3>
            <form onSubmit={handleApplyPromo} className="flex gap-2 mb-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo (e.g. SARAH_AIRPORT)"
                className="flex-1 bg-[#141923] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white uppercase placeholder-gray-500 outline-none focus:border-[#ccff00]"
              />
              <button
                type="submit"
                className="bg-[#1b2230] hover:bg-[#ccff00] hover:text-black text-gray-200 border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {fareBreakdown.appliedPromo && (
              <div className="flex items-center justify-between text-xs bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] px-3 py-1.5 rounded-xl">
                <span>{fareBreakdown.appliedPromo.description}</span>
                <span className="font-bold">-${fareBreakdown.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {promoError && <p className="text-[11px] text-rose-400 mt-1">{promoError}</p>}
          </div>

          {/* Payment Method & Total Breakdown */}
          <div className="bg-[#0e1219] border border-white/10 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#ccff00]" />
              Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl text-left border text-xs transition-all cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                    : 'bg-[#141923] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Wallet className="w-3.5 h-3.5 text-[#ccff00]" /> RidePay
                </div>
                <div className="text-[10px] text-gray-400">
                  Balance: ${currentUser ? currentUser.walletBalance.toFixed(2) : '142.50'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl text-left border text-xs transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                    : 'bg-[#141923] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#38bdf8]" /> Card
                </div>
                <div className="text-[10px] text-gray-400">•••• 4920 Visa</div>
              </button>
            </div>

            {/* Fare Breakdown List */}
            <div className="space-y-1.5 text-xs text-gray-300 pb-3 border-b border-white/10 font-mono">
              <div className="flex justify-between">
                <span className="font-sans text-gray-400">Base + Distance Fare</span>
                <span>${fareBreakdown.rideFare.toFixed(2)}</span>
              </div>
              {fareBreakdown.discountAmount > 0 && (
                <div className="flex justify-between text-[#ccff00]">
                  <span className="font-sans">Promo Discount</span>
                  <span>-${fareBreakdown.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {fareBreakdown.refreshmentsTotal > 0 && (
                <div className="flex justify-between">
                  <span className="font-sans text-gray-400">In-Ride Refreshments</span>
                  <span>+${fareBreakdown.refreshmentsTotal.toFixed(2)}</span>
                </div>
              )}
              {fareBreakdown.donationAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span className="font-sans">Carbon Offset Donation</span>
                  <span>+${fareBreakdown.donationAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-sans text-gray-400">Platform & Safety Fee</span>
                <span>+${fareBreakdown.serviceFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between pt-3 mb-5">
              <span className="text-sm font-bold text-white font-heading">Total Estimated Fare</span>
              <span className="text-2xl font-black text-[#ccff00] font-heading">
                ${fareBreakdown.finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Book Now Button */}
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.99] text-black font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#ccff00]/25 transition-all cursor-pointer"
            >
              Confirm & Book {selectedCab.name}
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
