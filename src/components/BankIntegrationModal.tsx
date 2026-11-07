import React, { useState } from 'react';
import {
  X,
  Building2,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  CreditCard,
  Lock,
} from 'lucide-react';
import { BankAccount } from '../types';
import { formatRupee } from '../utils/formatters';

interface BankIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccounts: BankAccount[];
  onSyncAll: () => void;
  isSyncing: boolean;
  onAddAccount: (account: BankAccount) => void;
  onTriggerBankDebit: () => void;
}

const SUPPORTED_BANKS = [
  { name: 'HDFC Bank', code: 'HDFC', color: '#004c8f', popular: true },
  { name: 'State Bank of India', code: 'SBI', color: '#280071', popular: true },
  { name: 'ICICI Bank', code: 'ICICI', color: '#b02a30', popular: true },
  { name: 'Axis Bank', code: 'AXIS', color: '#97144d', popular: true },
  { name: 'Kotak Mahindra Bank', code: 'KOTAK', color: '#ed1c24', popular: true },
  { name: 'Punjab National Bank', code: 'PNB', color: '#a21d22', popular: false },
  { name: 'Bank of Baroda', code: 'BOB', color: '#f26522', popular: false },
  { name: 'IndusInd Bank', code: 'INDUS', color: '#800000', popular: false },
];

export const BankIntegrationModal: React.FC<BankIntegrationModalProps> = ({
  isOpen,
  onClose,
  bankAccounts,
  onSyncAll,
  isSyncing,
  onAddAccount,
  onTriggerBankDebit,
}) => {
  const [view, setView] = useState<'list' | 'connect' | 'otp'>('list');
  const [selectedBank, setSelectedBank] = useState<string>('Axis Bank');
  const [accountType, setAccountType] = useState<'Savings' | 'Salary' | 'UPI Wallet'>('Savings');
  const [accountNumber, setAccountNumber] = useState<string>('6829');
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);

  const handleStartConnect = (bankName: string) => {
    setSelectedBank(bankName);
    setView('connect');
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setView('otp');
    setOtp('7392'); // Auto-fill convenient demo OTP
  };

  const handleConfirmOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const bankMeta = SUPPORTED_BANKS.find((b) => b.name === selectedBank) || SUPPORTED_BANKS[0];
      const initialBal = Math.floor(Math.random() * 8000) + 4000;

      const newAccount: BankAccount = {
        id: `bank-${Date.now()}`,
        bankName: selectedBank,
        accountNumber: `•••• ${accountNumber.slice(-4) || '9921'}`,
        accountType: accountType,
        balance: initialBal,
        color: bankMeta.color,
        logo: bankMeta.code,
        lastSynced: 'Just now',
      };

      onAddAccount(newAccount);
      setIsVerifying(false);
      setView('list');
      setSuccessMessage(`${selectedBank} linked successfully with balance ${formatRupee(initialBal)}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bank Account Integration
              </h2>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <ShieldCheck size={12} className="text-emerald-600" />
                RBI Account Aggregator (AA) Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success toast */}
        {successMessage && (
          <div className="m-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {view === 'list' && (
            <>
              {/* Aggregated Total Balance */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
                  <span>Aggregated Bank Balances</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <div className="text-2xl font-extrabold tracking-tight">
                  {formatRupee(totalBankBalance)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Balances automatically update your PocketTrack Home & Reports in real time.
                </p>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
                  <button
                    onClick={onSyncAll}
                    disabled={isSyncing}
                    className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync All Feeds'}</span>
                  </button>

                  <button
                    onClick={onTriggerBankDebit}
                    className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Simulate a new incoming bank debit notification"
                  >
                    <Sparkles size={13} />
                    <span>Test Bank Debit</span>
                  </button>
                </div>
              </div>

              {/* Linked Accounts List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Linked Accounts ({bankAccounts.length})
                  </h3>
                  <button
                    onClick={() => setView('connect')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Link Another Bank</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs"
                          style={{ backgroundColor: account.color }}
                        >
                          {account.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {account.bankName}
                            </h4>
                            {account.isPrimary && (
                              <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            {account.accountType} • {account.accountNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">
                          {formatRupee(account.balance)}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Synced {account.lastSynced}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security info card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex items-start gap-3 text-xs text-slate-500">
                <Lock size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-700">Bank-Grade Security</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    PocketTrack connects via end-to-end encrypted read-only financial data consent. We never store bank login passwords or transaction PINs.
                  </p>
                </div>
              </div>
            </>
          )}

          {view === 'connect' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Linked Banks
                </button>
                <span className="text-xs font-bold text-blue-600">Step 1 of 2</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Indian Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUPPORTED_BANKS.map((bank) => {
                    const isSelected = selectedBank === bank.name;
                    return (
                      <button
                        key={bank.name}
                        type="button"
                        onClick={() => setSelectedBank(bank.name)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg text-white font-extrabold text-[10px] flex items-center justify-center"
                          style={{ backgroundColor: bank.color }}
                        >
                          {bank.code}
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 truncate w-full">
                          {bank.name.replace('State Bank of India', 'SBI')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Savings', 'Salary', 'UPI Wallet'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAccountType(type)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer transition-colors ${
                          accountType === type
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Number / UPI ID
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter last 4 or full account number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <span>Verify with Bank OTP</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}

          {view === 'otp' && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Smartphone size={28} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verify Bank Account Consent
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  A one-time consent code was generated for linking {selectedBank} via RBI Account Aggregator.
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-digit code"
                  className="w-full text-center tracking-[1em] text-xl font-bold py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <p className="text-[11px] text-blue-600 mt-2 font-medium">
                  Simulated OTP pre-filled: {otp || '7392'}
                </p>
              </div>

              <div className="flex items-center gap-3 max-w-xs mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => setView('connect')}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOtp}
                  disabled={isVerifying}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-60"
                >
                  {isVerifying ? 'Verifying...' : 'Link Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
