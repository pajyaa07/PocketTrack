import React, { useState } from 'react';
import { X, Target, Plus, ShieldCheck, Laptop, Palmtree, Sparkles, CheckCircle2 } from 'lucide-react';
import { FinancialGoal } from '../types';
import { formatRupee } from '../utils/formatters';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: FinancialGoal[];
  onAddFunds: (goalId: string, amount: number) => void;
  onCreateGoal: (goal: FinancialGoal) => void;
}

export const GoalsModal: React.FC<GoalsModalProps> = ({
  isOpen,
  onClose,
  goals,
  onAddFunds,
  onCreateGoal,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState('Savings');
  const [selectedGoalForFund, setSelectedGoalForFund] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('1000');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newTarget);
    if (!newTitle.trim() || isNaN(target) || target <= 0) return;

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      targetAmount: target,
      currentAmount: 0,
      category: newCategory,
      deadline: '31 Dec 2026',
      icon: 'Target',
    };

    onCreateGoal(newGoal);
    setIsCreating(false);
    setNewTitle('');
    setNewTarget('');
  };

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForFund) return;
    const amount = parseFloat(fundAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddFunds(selectedGoalForFund, amount);
    }
    setSelectedGoalForFund(null);
  };

  const renderGoalIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck size={20} className="text-emerald-600" />;
      case 'Laptop':
        return <Laptop size={20} className="text-blue-600" />;
      case 'Palmtree':
        return <Palmtree size={20} className="text-amber-600" />;
      default:
        return <Target size={20} className="text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">My Financial Goals</h2>
              <p className="text-xs text-slate-400">Save systematically in Rupees (₹)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!isCreating ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Active Goals ({goals.length})
                </span>
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create New Goal</span>
                </button>
              </div>

              <div className="space-y-3">
                {goals.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                  const isCompleted = goal.currentAmount >= goal.targetAmount;

                  return (
                    <div
                      key={goal.id}
                      className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            {renderGoalIcon(goal.icon)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {goal.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              Target Date: {goal.deadline}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedGoalForFund(goal.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          + Add Funds
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold mt-1.5">
                          <span className="text-slate-900">
                            {formatRupee(goal.currentAmount)}
                            <span className="text-slate-400 font-normal"> / {formatRupee(goal.targetAmount)}</span>
                          </span>
                          <span className={isCompleted ? 'text-emerald-600' : 'text-blue-600'}>
                            {pct}% achieved
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Create a New Savings Goal</h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Enfield Bike / Home Renovation"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="50000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          )}

          {/* Quick Add Funds Sub-modal */}
          {selectedGoalForFund && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50">
              <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Add Savings from Balance</h4>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGoalForFund(null)}
                    className="flex-1 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFundSubmit}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
