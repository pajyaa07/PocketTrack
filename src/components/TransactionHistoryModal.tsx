import React, { useState } from 'react';
import { X, Search, Filter, Download, ArrowDownRight, Building2, Calendar } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatRupee } from '../utils/formatters';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  onExportCSV: () => void;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  expenses,
  onExportCSV,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Others'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
            <p className="text-xs text-slate-400">
              Showing {filteredExpenses.length} of {expenses.length} records in Rupees (₹)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="p-2 text-blue-600 hover:bg-blue-50 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
              title="Download CSV"
            >
              <Download size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 space-y-3 shrink-0">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses, merchants, or banks..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No transactions match your search</p>
              <p className="text-xs mt-1">Try another keyword or category filter</p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon category={exp.category} size="md" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {exp.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{exp.category}</span>
                      <span>•</span>
                      <span>{exp.date}, {exp.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-blue-600 font-medium mt-1">
                      <Building2 size={11} />
                      <span>{exp.accountName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-slate-900">
                    -{formatRupee(exp.amount)}
                  </span>
                  {exp.isBankImported && (
                    <span className="block text-[10px] font-semibold text-emerald-600 mt-0.5">
                      Bank Feeds
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
