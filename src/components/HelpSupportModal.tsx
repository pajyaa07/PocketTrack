import React from 'react';
import { X, HelpCircle, ShieldCheck, RefreshCw, Smartphone, Mail } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does Indian Bank Sync work?',
      a: 'PocketTrack utilizes the RBI-regulated Account Aggregator (AA) framework to securely fetch read-only transaction feeds from HDFC, ICICI, SBI, and Axis Bank without ever requesting netbanking passwords.',
    },
    {
      q: 'Are expenses automatically categorized?',
      a: 'Yes! Our merchant recognition rules map UPI handles and POS card transactions (like Swiggy, Uber, Zomato, DMart, Amazon) directly into their respective categories.',
    },
    {
      q: 'Can I export my statements for ITR or tax planning?',
      a: 'Yes. You can tap the Download icon on the Reports or History tab to export an Excel/CSV formatted expense sheet in Rupees (₹).',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Help & Support</h3>
              <p className="text-xs text-slate-400">Frequently Asked Questions & Guides</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center space-y-2">
            <Mail size={20} className="mx-auto text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900">Need personalized assistance?</h4>
            <p className="text-xs text-slate-600">
              Reach our support team at <span className="font-semibold text-blue-600">support@pockettrack.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
