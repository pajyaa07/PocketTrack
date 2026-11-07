import React from 'react';
import { Home, BarChart3, Wallet, User } from 'lucide-react';

export type NavTab = 'home' | 'reports' | 'budget' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'reports' as NavTab, label: 'Reports', icon: BarChart3 },
    { id: 'budget' as NavTab, label: 'Budget', icon: Wallet },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 z-30 flex items-center justify-between shadow-lg shadow-slate-200/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-all py-1 px-3 rounded-xl cursor-pointer ${
              isActive
                ? 'text-blue-600 scale-105'
                : 'text-slate-400 hover:text-slate-600 hover:scale-102'
            }`}
          >
            <Icon
              size={22}
              className={`transition-colors ${
                isActive ? 'stroke-[2.5] text-blue-600' : 'stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[11px] tracking-tight ${
                isActive ? 'font-bold text-blue-600' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
