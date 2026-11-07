import React, { useState } from 'react';
import { ChevronLeft, Calendar, Building2, Check, Sparkles } from 'lucide-react';
import { ExpenseCategory, BankAccount } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: {
    category: ExpenseCategory;
    description: string;
    amount: number;
    date: string;
    time: string;
    accountId: string;
    accountName: string;
  }) => void;
  bankAccounts: BankAccount[];
}

const CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Others',
];

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  bankAccounts,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [description, setDescription] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('21 Sep 2026, 12:30 PM');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    bankAccounts[0]?.id || ''
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a brief description');
      return;
    }

    const selectedAccount = bankAccounts.find((a) => a.id === selectedAccountId);

    onSaveExpense({
      category,
      description: description.trim(),
      amount: parsedAmount,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      accountId: selectedAccountId,
      accountName: selectedAccount ? `${selectedAccount.bankName} ${selectedAccount.accountNumber}` : 'Wallet',
    });

    // Reset
    setAmount('');
    setDescription('');
    setError('');
    onClose();
  };

  const handlePresetAmount = (preset: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + preset).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Add Expense</h2>
          <div className="w-8" />
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visual Category Spotlight (matching the Figma Separate screen variation) */}
          <div className="flex flex-col items-center justify-center pt-2">
            <CategoryIcon category={category} size="xl" shape="circle" />
            
            {/* Category dropdown toggle */}
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-bold rounded-full border border-slate-200 cursor-pointer transition-colors"
              >
                <span>{category}</span>
                <span className="text-xs text-slate-400">▼</span>
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30">
                  <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Category
                  </p>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <CategoryIcon category={cat} size="sm" />
                      <span className="text-sm font-semibold text-slate-800 flex-1">
                        {cat}
                      </span>
                      {category === cat && <Check size={16} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Amount Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Amount
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xl font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-slate-900 text-lg font-bold placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  autoFocus
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <Sparkles size={11} className="text-blue-500" />
                  Quick:
                </span>
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetAmount(preset)}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    +₹{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Lunch at restaurant"
                className="w-full px-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Date & Time Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Date & Time
              </label>
              <div className="relative flex items-center">
                <Calendar size={18} className="absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-50/60 border border-slate-200 rounded-2xl text-slate-800 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Calendar size={18} className="absolute right-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Debited Bank Account Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Deducted From (Bank / UPI)</span>
                <span className="text-[11px] font-normal text-blue-600 flex items-center gap-1">
                  <Building2 size={12} /> Auto-Balance Update
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {bankAccounts.map((account) => {
                  const isSelected = selectedAccountId === account.id;
                  return (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setSelectedAccountId(account.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {account.bankName.replace('State Bank of India', 'SBI')}
                        </span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {account.accountNumber}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {error}
              </p>
            )}

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer text-base"
              >
                Save Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
