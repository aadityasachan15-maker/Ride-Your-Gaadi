import React, { useState } from 'react';
import { X, Wallet, Plus, CreditCard, Check, Sparkles, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onTopUp: (amount: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onTopUp,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number>(50);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmTopUp = () => {
    onTopUp(topUpAmount);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0f131a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/20 flex items-center justify-center text-[#ccff00]">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-heading">RidePay Gaadi Wallet</h2>
            <p className="text-xs text-gray-400">Instant 1-click automated cab checkout</p>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="bg-gradient-to-br from-[#17231a] to-[#121721] border border-[#ccff00]/30 rounded-2xl p-5 mb-6 shadow-inner">
          <span className="text-xs text-gray-400 uppercase font-semibold">Available Balance</span>
          <p className="text-3xl sm:text-4xl font-black text-[#ccff00] font-heading mt-1">
            ${currentUser.walletBalance.toFixed(2)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Automatic deduction enabled for all rides</span>
          </div>
        </div>

        {/* Top-up options */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-gray-300">
            Select Top-Up Amount:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[25, 50, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTopUpAmount(amt)}
                className={`py-3 rounded-2xl text-sm font-extrabold font-mono transition-all border ${
                  topUpAmount === amt
                    ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-md shadow-[#ccff00]/20'
                    : 'bg-[#141923] text-gray-300 border-white/5 hover:border-white/10'
                }`}
              >
                +${amt}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleConfirmTopUp}
            disabled={isSuccess}
            className="w-full bg-[#ccff00] hover:bg-[#b8e600] disabled:bg-emerald-500 text-black font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-[#ccff00]/25 transition-all cursor-pointer mt-4"
          >
            {isSuccess ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                Added +${topUpAmount} Successfully!
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Add ${topUpAmount}.00 to RidePay
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
