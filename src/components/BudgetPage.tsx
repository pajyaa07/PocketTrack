import React, { useState } from 'react';
import { Target, Plus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { CategoryInfo, ExpenseCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatRupee } from '../utils/formatters';

interface BudgetPageProps {
  monthlyBudget: number;
  totalExpenses: number;
  categories: CategoryInfo[];
  onUpdateBudget: (categoryName: ExpenseCategory | 'overall', newLimit: number) => void;
}

export const BudgetPage: React.FC<BudgetPageProps> = ({
  monthlyBudget,
  totalExpenses,
  categories,
  onUpdateBudget,
}) => {
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | 'overall' | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<string>('');

  const remainingBudget = Math.max(0, monthlyBudget - totalExpenses);
  const percentUsed = Math.min(100, Math.round((totalExpenses / monthlyBudget) * 100));

  const startEdit = (catName: ExpenseCategory | 'overall', currentLimit: number) => {
    setEditingCategory(catName);
    setNewLimitInput(currentLimit.toString());
  };

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const val = parseFloat(newLimitInput);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(editingCategory, val);
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Budget</h1>
        <button
          onClick={() => startEdit('overall', monthlyBudget)}
          className="p-2 text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200/80 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1 text-xs font-bold"
          title="Adjust Monthly Budget"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Edit Limit</span>
        </button>
      </div>

      {/* Monthly Budget Master Card (matching screenshot) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Monthly Budget
              </span>
              <p className="text-2xl font-extrabold text-slate-900 leading-tight">
                {formatRupee(monthlyBudget)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {formatRupee(remainingBudget)} left
            </span>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 90
                ? 'bg-rose-500'
                : percentUsed > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>{percentUsed}% used</span>
          <span>{100 - percentUsed}% remaining</span>
        </div>
      </div>

      {/* Category Budgets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Category Budgets</h2>
          <span className="text-xs text-slate-400 font-medium">Tap card to edit limit</span>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const remaining = Math.max(0, cat.limit - cat.spent);
            const remainingPct = Math.round((remaining / cat.limit) * 100);
            const spentPct = Math.min(100, Math.round((cat.spent / cat.limit) * 100));

            return (
              <div
                key={cat.name}
                onClick={() => startEdit(cat.name, cat.limit)}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 transition-all shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={cat.name} size="md" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">
                        {formatRupee(remaining)} left ({remainingPct}%)
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">
                      {formatRupee(cat.limit)}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Spent: {formatRupee(cat.spent)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${spentPct}%`,
                      backgroundColor: spentPct > 90 ? '#ef4444' : cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingCategory === 'overall' ? 'Adjust Monthly Budget' : `Edit ${editingCategory} Budget`}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set your target spending limit for this period in Rupees.
            </p>

            <form onSubmit={handleSaveLimit} className="space-y-4">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={newLimitInput}
                  onChange={(e) => setNewLimitInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
