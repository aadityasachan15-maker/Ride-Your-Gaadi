import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroBooking } from './components/HeroBooking.tsx';
import { CabPicker } from './components/CabPicker.tsx';
import { LiveTrackingView } from './components/LiveTrackingView.tsx';
import { FleetView } from './components/FleetView.tsx';
import { DriverPortal } from './components/DriverPortal.tsx';
import { KanbanWorkspace } from './components/KanbanWorkspace.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { RideHistoryModal } from './components/RideHistoryModal.tsx';
import { WalletModal } from './components/WalletModal.tsx';
import {
  INITIAL_CABS,
  INITIAL_RIDES,
  CURRENT_USER,
} from './data/mockData.ts';
import { Cab, RideBooking, UserProfile, RideStatus } from './types/index.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ride' | 'drive' | 'fleet' | 'track' | 'kanban'>('ride');
  const [bookingStage, setBookingStage] = useState<'search' | 'cab_select' | 'live_tracking'>('search');

  // Core state
  const [cabs, setCabs] = useState<Cab[]>(INITIAL_CABS);
  const [rides, setRides] = useState<RideBooking[]>(INITIAL_RIDES);
  const [activeRide, setActiveRide] = useState<RideBooking | null>(INITIAL_RIDES[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(CURRENT_USER);

  // Search parameters
  const [searchPickup, setSearchPickup] = useState('');
  const [searchDestination, setSearchDestination] = useState('');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Sync with backend API if available, fallback cleanly
  useEffect(() => {
    fetch('/api/cabs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.cabs) setCabs(data.cabs);
      })
      .catch(() => {
        // Fallback already preloaded
      });

    fetch('/api/rides')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rides) setRides(data.rides);
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleSearchRide = (pickup: string, destination: string) => {
    setSearchPickup(pickup);
    setSearchDestination(destination);
    setBookingStage('cab_select');
  };

  const handleSelectSarahDemo = () => {
    setSearchPickup('Downtown Tech Park, Tower B');
    setSearchDestination('International Airport (Terminal 3)');
    setBookingStage('cab_select');
  };

  const handleConfirmBooking = (bookingData: any) => {
    const newRide: RideBooking = {
      id: 'RN-' + Math.floor(10000 + Math.random() * 90000),
      userId: currentUser?.id || 'usr_guest',
      userName: currentUser?.name || 'Sarah Jenkins',
      userPhone: currentUser?.phone || '+1 (555) 234-8901',
      pickup: bookingData.pickup,
      pickupCoords: { lat: 28.6139, lng: 77.209 },
      destination: bookingData.destination,
      destCoords: { lat: 28.5562, lng: 77.1 },
      cabId: bookingData.cab.id,
      cab: bookingData.cab,
      distanceKm: bookingData.distanceKm,
      durationMinutes: bookingData.durationMinutes,
      basePrice: bookingData.totalPrice,
      discountApplied: bookingData.promoCode ? 10.0 : 0,
      promoCode: bookingData.promoCode,
      donationAmount: bookingData.donationAmount,
      refreshments: bookingData.refreshments,
      totalPrice: bookingData.totalPrice,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: 'paid',
      status: 'driver_arriving',
      createdAt: new Date().toISOString(),
      currentProgressPercent: 12,
      speedKmh: 48,
    };

    // Deduct from wallet if wallet was used
    if (bookingData.paymentMethod === 'wallet' && currentUser) {
      setCurrentUser({
        ...currentUser,
        walletBalance: Math.max(0, currentUser.walletBalance - bookingData.totalPrice),
      });
    }

    setRides([newRide, ...rides]);
    setActiveRide(newRide);
    setBookingStage('live_tracking');
    setActiveTab('track');

    // Notify backend
    fetch('/api/rides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRide),
    }).catch(() => {});
  };

  const handleUpdateRide = useCallback((updated: RideBooking) => {
    setActiveRide(updated);
    setRides((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

    fetch(`/api/rides/${updated.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  }, []);

  const handleUpdateRideStatus = (rideId: string, newStatus: RideStatus) => {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, status: newStatus } : r))
    );
    if (activeRide?.id === rideId) {
      setActiveRide({ ...activeRide, status: newStatus });
    }
  };

  const handleTopUpWallet = (amount: number) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance + amount,
    };
    setCurrentUser(updatedUser);

    fetch('/api/wallet/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    }).catch(() => {});
  };

  const handleSelectRideToTrack = (ride: RideBooking) => {
    setActiveRide(ride);
    setActiveTab('track');
    setBookingStage('live_tracking');
  };

  return (
    <div className="min-h-screen bg-[#080a0d] text-white flex flex-col font-sans selection:bg-[#ccff00] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'ride' && bookingStage === 'live_tracking') {
            // keep state or allow browsing
          }
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onLogout={() => setCurrentUser(null)}
        hasActiveRide={activeRide?.status !== 'completed'}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'ride' && (
          <>
            {bookingStage === 'search' && (
              <HeroBooking
                onSearchRide={handleSearchRide}
                onSelectSarahDemo={handleSelectSarahDemo}
              />
            )}

            {bookingStage === 'cab_select' && (
              <CabPicker
                pickup={searchPickup || 'Downtown Tech Park, Tower B'}
                destination={searchDestination || 'International Airport (Terminal 3)'}
                cabs={cabs}
                currentUser={currentUser}
                onBack={() => setBookingStage('search')}
                onConfirmBooking={handleConfirmBooking}
              />
            )}

            {bookingStage === 'live_tracking' && activeRide && (
              <LiveTrackingView
                ride={activeRide}
                onUpdateRide={handleUpdateRide}
                onNewBooking={() => setBookingStage('search')}
              />
            )}
          </>
        )}

        {activeTab === 'track' && (
          <>
            {activeRide ? (
              <LiveTrackingView
                ride={activeRide}
                onUpdateRide={handleUpdateRide}
                onNewBooking={() => {
                  setActiveTab('ride');
                  setBookingStage('search');
                }}
              />
            ) : (
              <div className="max-w-md mx-auto text-center py-24 px-4">
                <div className="w-16 h-16 rounded-3xl bg-[#141923] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#ccff00]">
                  ⚡
                </div>
                <h2 className="text-xl font-bold font-heading">No Active Ride Found</h2>
                <p className="text-xs text-gray-400 mt-2 mb-6">
                  Book a quick ride to track your next-gen cab in real time.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('ride');
                    setBookingStage('search');
                  }}
                  className="bg-[#ccff00] text-black font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm"
                >
                  Book a Gaadi
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'fleet' && (
          <FleetView
            cabs={cabs}
            onSelectCabForBooking={(cab) => {
              setSearchPickup('Downtown Tech Park, Tower B');
              setSearchDestination('International Airport (Terminal 3)');
              setActiveTab('ride');
              setBookingStage('cab_select');
            }}
          />
        )}

        {activeTab === 'drive' && (
          <DriverPortal
            onAcceptIncomingTrip={(trip) => {
              // driver accepted
            }}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanWorkspace
            rides={rides}
            onUpdateRideStatus={handleUpdateRideStatus}
            onSelectRideToTrack={handleSelectRideToTrack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 px-4 sm:px-8 text-center text-xs text-gray-400 bg-[#07090c]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#ccff00] flex items-center justify-center text-black font-black text-xs">
              ⚡
            </div>
            <span className="font-extrabold text-white">yourgaadi.com</span>
            <span className="text-gray-400">• Fast & Reliable RideNow Mobility</span>
          </div>
          <p className="text-gray-400">
            Powered by MERN Stack Architecture • Anti-Gravity Comfort • 2.1s Acceleration
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
      />

      <RideHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        rides={rides}
        onRebook={(ride) => {
          setSearchPickup(ride.pickup);
          setSearchDestination(ride.destination);
          setActiveTab('ride');
          setBookingStage('cab_select');
        }}
      />

      {currentUser && (
        <WalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          currentUser={currentUser}
          onTopUp={handleTopUpWallet}
        />
      )}
    </div>
  );
}
