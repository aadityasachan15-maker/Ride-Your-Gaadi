import React, { useState } from 'react';
import { X, ArrowRight, Mail, Lock, Phone, User, Check, Shield } from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginTab, setLoginTab] = useState<'password' | 'otp'>('password');

  // Form states
  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('••••••••');
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address');
      return;
    }

    // Default Sarah profile for seamless experience
    const loggedUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: email.includes('sarah') ? 'Sarah Jenkins' : email.split('@')[0],
      email,
      phone: '+1 (555) 234-8901',
      role: 'passenger',
      walletBalance: 142.5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      savedAddresses: [
        { label: 'Work', address: 'Downtown Tech Park, Tower B' },
        { label: 'Frequent Hub', address: 'International Airport (Terminal 3)' },
      ],
      paymentMethods: [
        { id: 'pm_wallet', type: 'wallet', label: 'RidePay Gaadi Balance ($142.50)', isDefault: true },
        { id: 'pm_card_01', type: 'card', label: 'Titanium Visa', last4: '4920', isDefault: false },
      ],
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleSendOtp = () => {
    if (!phone) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setOtpSent(true);
    setOtpCode('4291'); // Auto-fill demo OTP
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the 4-digit code sent to your mobile');
      return;
    }

    const loggedUser: UserProfile = {
      id: 'usr_mobile_' + Date.now(),
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone,
      role: 'passenger',
      walletBalance: 142.5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      savedAddresses: [
        { label: 'Home', address: 'Downtown Tech Park' },
      ],
      paymentMethods: [
        { id: 'pm_wallet', type: 'wallet', label: 'RidePay Gaadi Balance ($142.50)', isDefault: true },
      ],
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and Email are required');
      return;
    }

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      role,
      walletBalance: 100.0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      savedAddresses: [],
      paymentMethods: [
        { id: 'pm_wallet_new', type: 'wallet', label: 'RidePay Gaadi Balance ($100.00)', isDefault: true },
      ],
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      {/* Modal Container matching screenshot 2 layout */}
      <div className="relative w-full max-w-md bg-[#0f131a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          aria-label="Close Auth Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {authMode === 'login' ? 'Login to yourgaadi.com' : 'Join next-gen mobility with RideNow'}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-xl">
            {error}
          </div>
        )}

        {authMode === 'login' ? (
          <div>
            {/* Segmented Switch: Password | Phone OTP matching Screenshot 2 */}
            <div className="flex bg-[#161b24] p-1 rounded-2xl mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => setLoginTab('password')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  loginTab === 'password'
                    ? 'bg-[#ccff00] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginTab('otp')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  loginTab === 'otp'
                    ? 'bg-[#ccff00] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Phone OTP
              </button>
            </div>

            {loginTab === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                  />
                </div>

                {/* Sign In Button matching screenshot 2 */}
                <button
                  type="submit"
                  className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-[#ccff00]/25 transition-all cursor-pointer mt-6"
                >
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="flex-1 bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="bg-[#202735] hover:bg-[#ccff00] hover:text-black text-gray-200 border border-white/10 px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-medium text-gray-400">
                        Verification Code (OTP)
                      </label>
                      <span className="text-[10px] text-[#ccff00]">Demo Code: 4291</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-center tracking-widest text-lg font-mono font-bold text-white outline-none transition-colors"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!otpSent}
                  className="w-full bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-[#ccff00]/25 transition-all cursor-pointer mt-6"
                >
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  Verify & Sign In
                </button>
              </form>
            )}

            {/* Bottom switch link matching screenshot 2 */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-xs font-semibold text-[#ccff00] hover:underline"
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </div>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#161b24] border border-white/10 focus:border-[#ccff00] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('passenger')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'passenger'
                      ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                      : 'bg-[#161b24] border-white/5 text-gray-400'
                  }`}
                >
                  Rider
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'driver'
                      ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                      : 'bg-[#161b24] border-white/5 text-gray-400'
                  }`}
                >
                  Driver Partner
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-[#ccff00]/25 transition-all cursor-pointer mt-6"
            >
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              Create Account
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs font-semibold text-[#ccff00] hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
