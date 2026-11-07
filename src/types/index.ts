export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Others';

export interface CategoryInfo {
  name: ExpenseCategory;
  color: string; // hex
  bgLight: string;
  iconName: string;
  limit: number;
  spent: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string; // e.g. "•••• 4921"
  accountType: 'Savings' | 'Salary' | 'UPI Wallet' | 'Credit Card';
  balance: number;
  color: string;
  logo: string;
  isPrimary?: boolean;
  lastSynced: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // e.g. "Today", "Yesterday", or "21 Sep 2026"
  time: string; // e.g. "11:45 AM"
  rawDate: string; // ISO string for sorting "2026-09-21T11:45:00"
  accountId: string; // linked bank account
  accountName: string;
  notes?: string;
  isBankImported?: boolean;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: string;
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'bank_sync' | 'budget_alert' | 'transaction' | 'goal';
}
