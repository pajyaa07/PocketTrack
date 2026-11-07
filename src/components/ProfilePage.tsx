import React, { useState } from 'react';
import {
  Settings,
  Pencil,
  Target,
  History,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Building2,
  Shield,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { formatRupee } from '../utils/formatters';

interface ProfilePageProps {
  userName: string;
  userEmail: string;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  onOpenGoals: () => void;
  onOpenHistory: () => void;
  onOpenBankModal: () => void;
  onOpenHelp: () => void;
  onOpenAbout: () => void;
  onResetData: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userName,
  userEmail,
  totalIncome,
  totalExpenses,
  totalBalance,
  onOpenGoals,
  onOpenHistory,
  onOpenBankModal,
  onOpenHelp,
  onOpenAbout,
  onResetData,
}) => {
  const [showSettingsNotice, setShowSettingsNotice] = useState(false);

  const menuItems = [
    {
      id: 'banks',
      title: 'Connected Bank Accounts',
      icon: Building2,
      color: 'text-indigo-600',
      badge: '3 Active',
      action: onOpenBankModal,
    },
    {
      id: 'goals',
      title: 'My Goals',
      icon: Target,
      color: 'text-blue-600',
      badge: '3 Goals',
      action: onOpenGoals,
    },
    {
      id: 'history',
      title: 'Transaction History',
      icon: History,
      color: 'text-slate-700',
      action: onOpenHistory,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      color: 'text-slate-700',
      action: onOpenHelp,
    },
    {
      id: 'about',
      title: 'About PocketTrack',
      icon: Info,
      color: 'text-slate-700',
      action: onOpenAbout,
    },
  ];

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
        <button
          onClick={() => setShowSettingsNotice(true)}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200/80 shadow-2xs cursor-pointer"
          title="Account Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Avatar & User Details */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-2xl font-extrabold shadow-inner border-2 border-white">
            PR
          </div>
          <button
            onClick={() => setShowSettingsNotice(true)}
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xs hover:bg-blue-700 cursor-pointer"
            title="Edit avatar"
          >
            <Pencil size={11} className="stroke-[2.5]" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mt-3 flex items-center gap-1.5 justify-center">
          {userName}
        </h2>
        <p className="text-xs text-slate-400 font-medium">{userEmail}</p>
      </div>

      {/* Stat Card Strip (Total Income | Total Expenses | Balance) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm grid grid-cols-3 divide-x divide-slate-100 text-center">
        <div className="px-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Income
          </p>
          <p className="text-xs sm:text-sm font-bold text-emerald-600">
            {formatRupee(totalIncome)}
          </p>
        </div>

        <div className="px-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Expenses
          </p>
          <p className="text-xs sm:text-sm font-bold text-rose-500">
            {formatRupee(totalExpenses)}
          </p>
        </div>

        <div className="px-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Balance
          </p>
          <p className="text-xs sm:text-sm font-bold text-blue-600">
            {formatRupee(totalBalance)}
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors ${item.color}`}>
                  <Icon size={18} className="stroke-[2.2]" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}

        {/* Log Out / Reset */}
        <button
          onClick={onResetData}
          className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 transition-colors text-left cursor-pointer text-rose-500 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
              <LogOut size={18} className="stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-rose-500">
              Reset Demo / Log Out
            </span>
          </div>
          <ChevronRight size={18} className="text-rose-300" />
        </button>
      </div>

      {/* Settings Toast / Notice */}
      {showSettingsNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Shield size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Account Security & Profile
            </h3>
            <p className="text-xs text-slate-500">
              Your profile is verified with Indian RBI Account Aggregator protocol & 256-bit encryption. Currency locked to INR (₹).
            </p>
            <button
              onClick={() => setShowSettingsNotice(false)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
