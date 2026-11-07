import React, { useState } from 'react';
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownRight, Building2, RefreshCw, ChevronRight } from 'lucide-react';
import { Expense, BankAccount } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatRupee } from '../utils/formatters';

interface HomePageProps {
  userName: string;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  recentExpenses: Expense[];
  bankAccounts: BankAccount[];
  onAddExpenseClick: () => void;
  onViewAllExpensesClick: () => void;
  onOpenBankModal: () => void;
  onSyncBanks: () => void;
  isSyncingBanks: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  userName,
  totalBalance,
  totalIncome,
  totalExpenses,
  recentExpenses,
  bankAccounts,
  onAddExpenseClick,
  onViewAllExpensesClick,
  onOpenBankModal,
  onSyncBanks,
  isSyncingBanks,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Greeting Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hello, {userName}!
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Track your money, build a better tomorrow.
        </p>
      </div>

      {/* Main Balance Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-sm font-medium">Total Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:text-slate-800 transition-colors text-blue-600 cursor-pointer"
            title={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Amount */}
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6 flex items-baseline gap-1">
          {showBalance ? formatRupee(totalBalance) : '••••••••'}
        </div>

        {/* Income / Expense Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ArrowUpRight size={16} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Income</p>
              <p className="text-sm font-bold text-emerald-600">
                {showBalance ? formatRupee(totalIncome) : '••••'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-l border-slate-100 pl-3">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <ArrowDownRight size={16} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Total Expenses</p>
              <p className="text-sm font-bold text-rose-500">
                {showBalance ? formatRupee(totalExpenses) : '••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Account Integration Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 p-4 rounded-2xl border border-blue-100/60 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Building2 size={13} />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Connected Bank Accounts ({bankAccounts.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSyncBanks}
              disabled={isSyncingBanks}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs cursor-pointer active:scale-95 transition-all disabled:opacity-60"
            >
              <RefreshCw size={11} className={isSyncingBanks ? 'animate-spin' : ''} />
              <span>{isSyncingBanks ? 'Syncing...' : '1-Click Sync'}</span>
            </button>
            <button
              onClick={onOpenBankModal}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Bank quick chips */}
        <div className="grid grid-cols-3 gap-2">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              onClick={onOpenBankModal}
              className="bg-white p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {account.bankName.replace('State Bank of India', 'SBI')}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {account.accountNumber.slice(-4)}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {showBalance ? formatRupee(account.balance) : '••••'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Expenses</h2>
          <button
            onClick={onViewAllExpensesClick}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentExpenses.slice(0, 4).map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <CategoryIcon category={expense.category} size="md" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {expense.category}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {expense.date}, {expense.time}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  {formatRupee(expense.amount)}
                </span>
                {expense.isBankImported && (
                  <p className="text-[10px] text-blue-600 font-medium">Bank Synced</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onAddExpenseClick}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-base"
        >
          <Plus size={20} className="stroke-[2.5]" />
          <span>Add Expense</span>
        </button>
      </div>
    </div>
  );
};
