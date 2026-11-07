import React from 'react';
import { Utensils, Car, ShoppingBag, Gamepad2, FileText, MoreHorizontal } from 'lucide-react';
import { ExpenseCategory } from '../types';

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'squircle' | 'circle';
  className?: string;
}

export const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string; bgSoft: string; border: string }> = {
  'Food & Dining': {
    bg: 'bg-[#FF7A00]',
    text: 'text-white',
    bgSoft: 'bg-orange-50',
    border: 'border-orange-200',
  },
  'Transport': {
    bg: 'bg-[#3B82F6]',
    text: 'text-white',
    bgSoft: 'bg-blue-50',
    border: 'border-blue-200',
  },
  'Shopping': {
    bg: 'bg-[#8B5CF6]',
    text: 'text-white',
    bgSoft: 'bg-purple-50',
    border: 'border-purple-200',
  },
  'Entertainment': {
    bg: 'bg-[#EC4899]',
    text: 'text-white',
    bgSoft: 'bg-pink-50',
    border: 'border-pink-200',
  },
  'Bills': {
    bg: 'bg-[#F59E0B]',
    text: 'text-white',
    bgSoft: 'bg-amber-50',
    border: 'border-amber-200',
  },
  'Others': {
    bg: 'bg-[#06B6D4]',
    text: 'text-white',
    bgSoft: 'bg-teal-50',
    border: 'border-teal-200',
  },
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  shape = 'squircle',
  className = '',
}) => {
  const meta = CATEGORY_COLORS[category] || CATEGORY_COLORS['Others'];

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl p-1.5',
    md: 'w-11 h-11 rounded-2xl p-2.5',
    lg: 'w-14 h-14 rounded-2xl p-3.5',
    xl: 'w-16 h-16 rounded-3xl p-4',
  }[size];

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
    xl: 32,
  }[size];

  const roundedShape = shape === 'circle' ? 'rounded-full' : '';

  const renderIcon = () => {
    switch (category) {
      case 'Food & Dining':
        return <Utensils size={iconSizes} strokeWidth={2.2} />;
      case 'Transport':
        return <Car size={iconSizes} strokeWidth={2.2} />;
      case 'Shopping':
        return <ShoppingBag size={iconSizes} strokeWidth={2.2} />;
      case 'Entertainment':
        return <Gamepad2 size={iconSizes} strokeWidth={2.2} />;
      case 'Bills':
        return <FileText size={iconSizes} strokeWidth={2.2} />;
      case 'Others':
      default:
        return <MoreHorizontal size={iconSizes} strokeWidth={2.2} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95 ${meta.bg} ${meta.text} ${sizeClasses} ${roundedShape} ${className}`}
    >
      {renderIcon()}
    </div>
  );
};
