import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Zap, Shield, Plane } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/mockData.ts';

interface HeroBookingProps {
  onSearchRide: (pickup: string, destination: string) => void;
  onSelectSarahDemo: () => void;
}

export const HeroBooking: React.FC<HeroBookingProps> = ({
  onSearchRide,
  onSelectSarahDemo,
}) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim()) {
      setErrorMessage('Please enter a pickup location');
      return;
    }
    if (!destination.trim()) {
      setErrorMessage('Please enter a destination');
      return;
    }
    setErrorMessage('');
    onSearchRide(pickup.trim(), destination.trim());
  };

  const handleApplyPreset = (locName: string, isDest: boolean) => {
    if (isDest) {
      setDestination(locName);
      if (!pickup) setPickup('Downtown Tech Park, Tower B');
    } else {
      setPickup(locName);
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-6 pb-16 lg:py-16">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Brief, & Booking Box */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* Next-Gen Mobility Pill matching screenshot 1 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121720] border border-[#ccff00]/30 text-[#ccff00] text-xs font-semibold mb-6 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-[#ccff00]" />
              <span>Next-Gen Mobility</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-5 font-heading">
              Ride the <br />
              <span className="text-[#ccff00] drop-shadow-sm">Future.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              Experience seamless, high-performance rides powered by anti-gravity comfort and cutting-edge technology. Book your gaadi in seconds.
            </p>

            {/* Quick Demo Trigger: Sarah's Urgent Airport Trip */}
            <div className="w-full max-w-lg mb-4">
              <button
                type="button"
                onClick={onSelectSarahDemo}
                className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-[#17202d] to-[#12161f] border border-[#ccff00]/40 hover:border-[#ccff00] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ccff00]/20 flex items-center justify-center text-[#ccff00] shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        Sarah's Urgent Airport Rush
                      </span>
                      <span className="text-[10px] bg-[#ccff00] text-black font-extrabold px-1.5 py-0.5 rounded">
                        DEMO STORY
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <span>Downtown Tech Park</span>
                      <ArrowRight className="w-3 h-3 text-[#ccff00] inline shrink-0" />
                      <span>Terminal 3 (3-min ETA cab)</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#ccff00] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 self-end sm:self-center">
                  1-Click Book <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

            {/* Booking Form Card matching screenshot 1 */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg bg-[#0e1219]/95 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative"
            >
              {errorMessage && (
                <div className="mb-4 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3 mb-5">
                {/* Pickup input */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">
                    <MapPin className="w-4 h-4 text-[#ccff00]" />
                  </div>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full bg-[#141923] border border-white/10 focus:border-[#ccff00] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>

                {/* Destination input */}
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">
                    <Navigation className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full bg-[#141923] border border-white/10 focus:border-[#ccff00] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Find Ride Button matching screenshot 1 */}
              <button
                type="submit"
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.99] text-black font-extrabold text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/25 transition-all cursor-pointer"
              >
                Find Ride
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Popular destinations quick chips */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Popular High-Demand Hubs:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_LOCATIONS.slice(0, 3).map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handleApplyPreset(loc.name, true)}
                      className="text-[11px] bg-[#141923] hover:bg-white/10 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 transition-colors text-left cursor-pointer"
                    >
                      {loc.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Cleaned & Focused Next-Gen Cyber Car Graphic & Badges matching Screenshot 1 */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c0f15] via-[#080a0e] to-[#111620] border border-white/10 shadow-2xl flex items-center justify-center p-2 group">
              {/* Radial glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ccff00]/15 via-transparent to-transparent opacity-75" />

              {/* Precision-framed hypercar visual: crops out browser chrome & taskbar from the screenshot */}
              <div className="relative z-10 w-full h-full overflow-hidden rounded-2xl flex items-center justify-center">
                <img
                  src="/assets/aistudio/Screenshot__416__c8f619f8.png"
                  alt="Cyber Hypercar"
                  className="w-full h-full object-cover object-[73%_52%] scale-[1.95] transform brightness-105 contrast-110 transition-transform duration-700 group-hover:scale-[2.05]"
                />

                {/* Cybernetic HUD Vignette & Neon Ambient Mist */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080a0d] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#080a0d]/60 via-transparent to-[#080a0d]/60" />

                {/* Ground reflection bar */}
                <div className="absolute bottom-4 w-2/3 h-1 bg-gradient-to-r from-transparent via-[#ccff00]/70 to-transparent blur-sm" />
              </div>

              {/* Top Right Floating Badge matching screenshot 1 */}
              <div className="absolute top-5 right-5 z-20 bg-[#12161f]/90 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-black/80">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    0-100 km/h
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-white">
                    2.1s Acceleration
                  </p>
                </div>
              </div>

              {/* Bottom Left Floating Badge matching screenshot 1 */}
              <div className="absolute bottom-5 left-5 z-20 bg-[#12161f]/90 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-black/80">
                <div className="w-8 h-8 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
                  <Shield className="w-4 h-4 fill-[#38bdf8]/30" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">
                    Security Level
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-white">
                    Titanium Class
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
