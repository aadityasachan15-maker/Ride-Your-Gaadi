import React, { useState } from 'react';
import { Zap, Menu, X, User, Shield, Compass, Car, LayoutGrid, Clock, Wallet } from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface NavbarProps {
  activeTab: 'ride' | 'drive' | 'fleet' | 'track' | 'kanban';
  setActiveTab: (tab: 'ride' | 'drive' | 'fleet' | 'track' | 'kanban') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenWallet: () => void;
  onLogout: () => void;
  hasActiveRide: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenHistory,
  onOpenWallet,
  onLogout,
  hasActiveRide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3 bg-[#080a0d]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo matching screenshot 1 & 2 */}
        <button
          onClick={() => setActiveTab('ride')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-[#ccff00] flex items-center justify-center text-black shadow-md shadow-[#ccff00]/20 transition-transform group-hover:scale-105">
            <Zap className="w-5 h-5 fill-black stroke-black" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-heading">
            yourgaadi<span className="text-[#ccff00]">.com</span>
          </span>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#12161f] border border-white/10 px-3 py-1.5 rounded-full shadow-inner">
          <button
            onClick={() => setActiveTab('ride')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'ride'
                ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Ride
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'drive'
                ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Drive
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'fleet'
                ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Our Fleet
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'track'
                ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Track Ride
            {hasActiveRide && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ccff00]"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'kanban'
                ? 'bg-[#ccff00] text-black shadow-sm font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Kanban
          </button>
        </nav>

        {/* Right Action: User Auth & Wallet */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 bg-[#141923] border border-white/10 hover:border-[#ccff00]/40 px-3 py-1.5 rounded-full transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#ccff00]/60"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#ccff00] font-mono font-medium">
                    ${currentUser.walletBalance.toFixed(2)}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#131822] border border-white/10 rounded-2xl shadow-2xl p-2 z-50">
                  <div className="p-2 border-b border-white/10">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{currentUser.email}</p>
                    <div className="mt-2 flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5">
                      <span className="text-xs text-gray-300 flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-[#ccff00]" /> RidePay
                      </span>
                      <span className="text-xs font-bold text-[#ccff00]">
                        ${currentUser.walletBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenWallet();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/5 rounded-xl flex items-center gap-2"
                    >
                      <Wallet className="w-4 h-4 text-gray-400" />
                      Add Money to Wallet
                    </button>
                    <button
                      onClick={() => {
                        onOpenHistory();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-gray-200 hover:bg-white/5 rounded-xl flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      Ride History & Receipts
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-[#161b24] hover:bg-[#1e2532] text-gray-200 border border-white/15 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <button
              onClick={onOpenWallet}
              className="bg-[#141923] border border-white/10 px-2.5 py-1 rounded-full text-xs font-mono text-[#ccff00]"
            >
              ${currentUser.walletBalance.toFixed(0)}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#141922] text-gray-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 pb-2">
          <button
            onClick={() => {
              setActiveTab('ride');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-2 text-left rounded-xl text-sm font-semibold ${
              activeTab === 'ride' ? 'bg-[#ccff00] text-black font-bold' : 'text-gray-300'
            }`}
          >
            Ride
          </button>
          <button
            onClick={() => {
              setActiveTab('drive');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-2 text-left rounded-xl text-sm font-semibold ${
              activeTab === 'drive' ? 'bg-[#ccff00] text-black font-bold' : 'text-gray-300'
            }`}
          >
            Drive
          </button>
          <button
            onClick={() => {
              setActiveTab('fleet');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-2 text-left rounded-xl text-sm font-semibold ${
              activeTab === 'fleet' ? 'bg-[#ccff00] text-black font-bold' : 'text-gray-300'
            }`}
          >
            Our Fleet
          </button>
          <button
            onClick={() => {
              setActiveTab('track');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-2 text-left rounded-xl text-sm font-semibold ${
              activeTab === 'track' ? 'bg-[#ccff00] text-black font-bold' : 'text-gray-300'
            }`}
          >
            Track Ride {hasActiveRide && '🟢 Live'}
          </button>
          <button
            onClick={() => {
              setActiveTab('kanban');
              setMobileMenuOpen(false);
            }}
            className={`px-4 py-2 text-left rounded-xl text-sm font-semibold ${
              activeTab === 'kanban' ? 'bg-[#ccff00] text-black font-bold' : 'text-gray-300'
            }`}
          >
            Transportation Kanban
          </button>

          <div className="pt-2 border-t border-white/10">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenHistory();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-left rounded-xl text-sm text-gray-300 hover:bg-white/5"
                >
                  Booking History
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-left rounded-xl text-sm text-red-400"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#ccff00] text-black font-bold py-2.5 rounded-xl text-center text-sm"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
