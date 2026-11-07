import React from 'react';
import { X, Users, Search, Lightbulb, Cog, Target, Wallet, CheckCircle2 } from 'lucide-react';

interface AboutPocketTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutPocketTrackModal: React.FC<AboutPocketTrackModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const pillars = [
    {
      title: 'Empathize',
      subtitle: 'Understand user needs and pain points (e.g., overspending, no clarity on budget).',
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      title: 'Define',
      subtitle: 'Focus on key problems (e.g., need simple and intuitive tracking).',
      icon: Search,
      color: 'bg-purple-600',
    },
    {
      title: 'Ideate',
      subtitle: 'Generate solutions (e.g., easy expense entry, reports, budget limits).',
      icon: Lightbulb,
      color: 'bg-orange-500',
    },
    {
      title: 'Prototype & Test',
      subtitle: 'Build the app, get feedback, refine the experience.',
      icon: Cog,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">About PocketTrack</h2>
              <p className="text-xs text-slate-500">Track • Manage • Achieve</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Mission Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Target size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Our Mission & Goal
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                Help users take control of their finances with a simple, intuitive and visual way to track expenses, manage budgets and achieve their financial goals in Rupees (₹).
              </p>
            </div>
          </div>

          {/* Design Thinking Approach */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Design Thinking Approach
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${pillar.color} text-white flex items-center justify-center`}>
                        <Icon size={16} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {pillar.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {pillar.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* App Specifications */}
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Version</span>
              <span className="font-bold text-slate-900">PocketTrack 2.5 (INR)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Currency Standard</span>
              <span className="font-bold text-slate-900">Indian Rupee (₹, INR)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Bank Protocol</span>
              <span className="font-bold text-slate-900">RBI Account Aggregator Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
