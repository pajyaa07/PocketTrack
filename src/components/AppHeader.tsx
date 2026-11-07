import React from 'react';
import { Bell, Wallet, Building2, Smartphone, Monitor } from 'lucide-react';

interface AppHeaderProps {
  onOpenNotifications: () => void;
  onOpenBankModal: () => void;
  unreadCount: number;
  isWideView: boolean;
  onToggleViewMode: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenNotifications,
  onOpenBankModal,
  unreadCount,
  isWideView,
  onToggleViewMode,
}) => {
  return (
    <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Wallet size={22} className="stroke-[2.2]" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
            PocketTrack
          </span>
          <p className="text-[10px] font-semibold tracking-wider uppercase text-blue-600">
            INR Edition (₹)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Bank Integration quick button */}
        <button
          onClick={onOpenBankModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors border border-blue-100/80 cursor-pointer"
          title="Bank Accounts & UPI Integration"
        >
          <Building2 size={14} className="text-blue-600" />
          <span className="hidden sm:inline">Bank Sync</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* View Toggle (Mobile / Desktop) */}
        <button
          onClick={onToggleViewMode}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer hidden md:flex items-center justify-center"
          title={isWideView ? 'Switch to Phone View' : 'Switch to Full Width'}
        >
          {isWideView ? <Smartphone size={18} /> : <Monitor size={18} />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} className="stroke-[2]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
