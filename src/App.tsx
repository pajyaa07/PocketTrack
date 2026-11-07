/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_EXPENSES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CATEGORIES,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
  SPENDING_TREND_DAYS,
} from './data/initialData';
import {
  Expense,
  BankAccount,
  CategoryInfo,
  ExpenseCategory,
  FinancialGoal,
  AppNotification,
} from './types';
import { AppHeader } from './components/AppHeader';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { ReportsPage } from './components/ReportsPage';
import { BudgetPage } from './components/BudgetPage';
import { ProfilePage } from './components/ProfilePage';
import { AddExpenseModal } from './components/AddExpenseModal';
import { BankIntegrationModal } from './components/BankIntegrationModal';
import { TransactionHistoryModal } from './components/TransactionHistoryModal';
import { GoalsModal } from './components/GoalsModal';
import { AboutPocketTrackModal } from './components/AboutPocketTrackModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Wifi, Signal, Battery, Smartphone, LayoutDashboard } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'pockettrack_inr_v1_';

export default function App() {
  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Core Financial Data State with LocalStorage Persistence
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}banks`);
    return saved ? JSON.parse(saved) : INITIAL_BANK_ACCOUNTS;
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}monthly_budget`);
    return saved ? parseFloat(saved) : 20000;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}goals`);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Modal States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // View Layout: Mobile device frame vs Wide layout
  const [isWideView, setIsWideView] = useState(false);

  // Period in Reports
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [isSyncingBanks, setIsSyncingBanks] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}banks`, JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}monthly_budget`, monthlyBudget.toString());
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}goals`, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Derived Financial Calculations
  const totalBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);
  const totalIncome = 25000; // Fixed monthly benchmark in design
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category percentages for Donut chart and Top Expenses
  const categoryPercentages = categories.map((cat) => {
    const catTotal = expenses
      .filter((e) => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);

    const percent = totalExpenses > 0 ? Math.round((catTotal / totalExpenses) * 100) : 0;
    return {
      category: cat.name,
      amount: catTotal,
      percent,
      color: cat.color,
    };
  }).sort((a, b) => b.amount - a.amount);

  // Dynamic Spending Trends
  const spendingTrends = SPENDING_TREND_DAYS.map((item) => {
    // If today is 21 Sep, add today's added expenses to the last day
    if (item.day === '21 Sep') {
      const todayTotal = expenses
        .filter((e) => e.date === 'Today' || e.rawDate?.startsWith('2026-09-21'))
        .reduce((sum, e) => sum + e.amount, 0);
      return { day: item.day, amount: todayTotal > 0 ? todayTotal : item.amount };
    }
    return item;
  });

  // Handler: Add Expense
  const handleSaveExpense = (newExpenseData: {
    category: ExpenseCategory;
    description: string;
    amount: number;
    date: string;
    time: string;
    accountId: string;
    accountName: string;
  }) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      category: newExpenseData.category,
      description: newExpenseData.description,
      amount: newExpenseData.amount,
      date: newExpenseData.date,
      time: newExpenseData.time,
      rawDate: new Date().toISOString(),
      accountId: newExpenseData.accountId,
      accountName: newExpenseData.accountName,
    };

    // Update expenses list
    setExpenses((prev) => [newExpense, ...prev]);

    // Deduct from linked bank account
    setBankAccounts((prev) =>
      prev.map((acc) =>
        acc.id === newExpenseData.accountId
          ? { ...acc, balance: Math.max(0, acc.balance - newExpenseData.amount) }
          : acc
      )
    );

    // Update spent in category
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === newExpenseData.category
          ? { ...cat, spent: cat.spent + newExpenseData.amount }
          : cat
      )
    );

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Expense Recorded',
      message: `₹${newExpenseData.amount} paid for "${newExpenseData.description}" via ${newExpenseData.accountName}.`,
      timestamp: 'Just now',
      read: false,
      type: 'transaction',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handler: Sync All Banks
  const handleSyncBanks = () => {
    setIsSyncingBanks(true);
    setTimeout(() => {
      setBankAccounts((prev) =>
        prev.map((acc) => ({ ...acc, lastSynced: 'Just now' }))
      );
      setIsSyncingBanks(false);
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Bank Accounts Synced',
        message: 'Successfully refreshed real-time feeds from HDFC, ICICI, and SBI accounts.',
        timestamp: 'Just now',
        read: false,
        type: 'bank_sync',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }, 1200);
  };

  // Handler: Trigger Simulated Bank Debit
  const handleTriggerBankDebit = () => {
    const randomDebits = [
      { desc: 'Swiggy Food Delivery', cat: 'Food & Dining' as ExpenseCategory, amt: 340, bankId: 'bank-hdfc' },
      { desc: 'Uber Auto Ride', cat: 'Transport' as ExpenseCategory, amt: 180, bankId: 'bank-sbi' },
      { desc: 'Amazon Pay Shopping', cat: 'Shopping' as ExpenseCategory, amt: 850, bankId: 'bank-icici' },
      { desc: 'Jio Fiber Broadband Bill', cat: 'Bills' as ExpenseCategory, amt: 999, bankId: 'bank-hdfc' },
    ];
    const picked = randomDebits[Math.floor(Math.random() * randomDebits.length)];
    const bank = bankAccounts.find((b) => b.id === picked.bankId) || bankAccounts[0];

    handleSaveExpense({
      category: picked.cat,
      description: picked.desc,
      amount: picked.amt,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      accountId: bank.id,
      accountName: `${bank.bankName} ${bank.accountNumber}`,
    });
  };

  // Handler: Add New Bank Account
  const handleAddBankAccount = (newAcc: BankAccount) => {
    setBankAccounts((prev) => [...prev, newAcc]);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Bank Account Connected',
      message: `${newAcc.bankName} (${newAcc.accountNumber}) linked with balance ₹${newAcc.balance}.`,
      timestamp: 'Just now',
      read: false,
      type: 'bank_sync',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handler: Update Budget Limits
  const handleUpdateBudget = (categoryName: ExpenseCategory | 'overall', newLimit: number) => {
    if (categoryName === 'overall') {
      setMonthlyBudget(newLimit);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.name === categoryName ? { ...c, limit: newLimit } : c))
      );
    }
  };

  // Handler: Add Funds to Financial Goal
  const handleAddGoalFunds = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + amount }
          : g
      )
    );
    // Deduct from primary bank
    setBankAccounts((prev) =>
      prev.map((b, idx) =>
        idx === 0 ? { ...b, balance: Math.max(0, b.balance - amount) } : b
      )
    );
  };

  // Handler: Create New Financial Goal
  const handleCreateGoal = (goal: FinancialGoal) => {
    setGoals((prev) => [...prev, goal]);
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Time', 'Category', 'Description', 'Amount (INR)', 'Bank Account'];
    const rows = expenses.map((e) => [
      e.id,
      e.date,
      e.time,
      e.category,
      `"${e.description.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.accountName}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PocketTrack_Expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler: Reset Data to Demo Defaults
  const handleResetData = () => {
    if (window.confirm('Reset PocketTrack to original sample data?')) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}expenses`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}banks`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}categories`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}monthly_budget`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}goals`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}notifications`);

      setExpenses(INITIAL_EXPENSES);
      setBankAccounts(INITIAL_BANK_ACCOUNTS);
      setCategories(INITIAL_CATEGORIES);
      setMonthlyBudget(20000);
      setGoals(INITIAL_GOALS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setCurrentTab('home');
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col items-center justify-start md:py-6 md:px-4 selection:bg-blue-500 selection:text-white">
      {/* Top Floating Control Bar for Demo / Presentation */}
      <aside aria-label="Device presentation switcher" className="w-full max-w-md md:max-w-xl mb-3 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-tight text-white">PocketTrack</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Indian Rupee (₹) Edition</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWideView(!isWideView)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700"
          >
            {isWideView ? (
              <>
                <Smartphone size={13} />
                <span>Mobile Frame</span>
              </>
            ) : (
              <>
                <LayoutDashboard size={13} />
                <span>Wide Dashboard</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Container: Mobile Phone Frame or Expanded Dashboard */}
      <div
        className={`w-full transition-all duration-300 bg-[#f8fafc] flex flex-col relative overflow-hidden ${
          isWideView
            ? 'max-w-4xl rounded-3xl shadow-2xl border border-slate-700 min-h-[90vh]'
            : 'max-w-md md:rounded-[44px] shadow-2xl md:border-[10px] md:border-slate-800 min-h-screen md:min-h-[844px]'
        }`}
      >
        {/* Mobile Status Bar (9:41, Cellular, WiFi, Battery) */}
        {!isWideView && (
          <div className="px-7 pt-3 pb-1 flex items-center justify-between text-slate-900 text-[13px] font-bold select-none z-30 bg-white">
            <span>9:41</span>
            {/* Dynamic Island / Speaker Pill */}
            <div className="w-24 h-4 bg-slate-900 rounded-full" />
            <div className="flex items-center gap-1.5 text-slate-800">
              <Signal size={14} className="stroke-[2.5]" />
              <Wifi size={14} className="stroke-[2.5]" />
              <Battery size={16} className="stroke-[2.5]" />
            </div>
          </div>
        )}

        {/* Brand App Header */}
        <AppHeader
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenBankModal={() => setIsBankModalOpen(true)}
          unreadCount={unreadNotifCount}
          isWideView={isWideView}
          onToggleViewMode={() => setIsWideView(!isWideView)}
        />

        {/* Tab Content Body */}
        <main className="flex-1 px-5 pt-3 overflow-y-auto">
          {currentTab === 'home' && (
            <HomePage
              userName="Prajwal"
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              recentExpenses={expenses}
              bankAccounts={bankAccounts}
              onAddExpenseClick={() => setIsAddExpenseOpen(true)}
              onViewAllExpensesClick={() => setIsHistoryOpen(true)}
              onOpenBankModal={() => setIsBankModalOpen(true)}
              onSyncBanks={handleSyncBanks}
              isSyncingBanks={isSyncingBanks}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsPage
              totalExpenses={totalExpenses}
              period={reportPeriod}
              onPeriodChange={setReportPeriod}
              categoryPercentages={categoryPercentages}
              spendingTrends={spendingTrends}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetPage
              monthlyBudget={monthlyBudget}
              totalExpenses={totalExpenses}
              categories={categories}
              onUpdateBudget={handleUpdateBudget}
            />
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              userName="Prajwal Rasal"
              userEmail="prajwal.rasal@example.com"
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              totalBalance={totalBalance}
              onOpenGoals={() => setIsGoalsOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenBankModal={() => setIsBankModalOpen(true)}
              onOpenHelp={() => setIsHelpOpen(true)}
              onOpenAbout={() => setIsAboutOpen(true)}
              onResetData={handleResetData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSaveExpense={handleSaveExpense}
        bankAccounts={bankAccounts}
      />

      <BankIntegrationModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        bankAccounts={bankAccounts}
        onSyncAll={handleSyncBanks}
        isSyncing={isSyncingBanks}
        onAddAccount={handleAddBankAccount}
        onTriggerBankDebit={handleTriggerBankDebit}
      />

      <TransactionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        expenses={expenses}
        onExportCSV={handleExportCSV}
      />

      <GoalsModal
        isOpen={isGoalsOpen}
        onClose={() => setIsGoalsOpen(false)}
        goals={goals}
        onAddFunds={handleAddGoalFunds}
        onCreateGoal={handleCreateGoal}
      />

      <AboutPocketTrackModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
      />
    </div>
  );
}
