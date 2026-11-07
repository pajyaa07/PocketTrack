import React from 'react';
import { X, Bell, Building2, AlertTriangle, ArrowDownRight, Check, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const renderIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'bank_sync':
        return <Building2 size={16} className="text-blue-600" />;
      case 'budget_alert':
        return <AlertTriangle size={16} className="text-amber-600" />;
      case 'transaction':
        return <ArrowDownRight size={16} className="text-emerald-600" />;
      default:
        return <Bell size={16} className="text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Mark read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No recent notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-white border-slate-100'
                    : 'bg-blue-50/40 border-blue-100/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                    {renderIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-center">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear notification history</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
