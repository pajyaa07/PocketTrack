import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, Info } from 'lucide-react';
import { ExpenseCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatRupee, formatCompactRupee } from '../utils/formatters';

interface ReportsPageProps {
  totalExpenses: number;
  period: 'weekly' | 'monthly' | 'yearly';
  onPeriodChange: (p: 'weekly' | 'monthly' | 'yearly') => void;
  categoryPercentages: {
    category: ExpenseCategory;
    amount: number;
    percent: number;
    color: string;
  }[];
  spendingTrends: { day: string; amount: number }[];
  onExportCSV: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  totalExpenses,
  period,
  onPeriodChange,
  categoryPercentages,
  spendingTrends,
  onExportCSV,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<{ day: string; amount: number } | null>(null);

  // SVG Donut Calculations
  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  // Maximum value for bar chart Y scale (round up to nearest 5k or max + 500)
  const maxTrend = Math.max(...spendingTrends.map((t) => t.amount), 5000);
  const chartHeight = 130;

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Page Title & Filter Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
            title="Export CSV Statement"
          >
            <Download size={18} />
          </button>
          <div className="p-2 text-slate-600 bg-white rounded-xl border border-slate-200/80 shadow-2xs cursor-pointer">
            <Calendar size={18} />
          </div>
        </div>
      </div>

      {/* Period Segmented Control */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-between">
        {(['weekly', 'monthly', 'yearly'] as const).map((p) => {
          const isActive = period === p;
          return (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Expense Overview Card (Donut Chart & Breakdown) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Expense Overview</h2>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut Chart */}
          <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background circle track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Slices */}
              {categoryPercentages.map((item) => {
                const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += (item.percent / 100) * circumference;

                const isHovered = hoveredSlice === item.category;

                return (
                  <circle
                    key={item.category}
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={item.color}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(item.category)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
              <span className="text-[13px] font-extrabold text-slate-900 tracking-tight">
                {hoveredSlice
                  ? formatRupee(
                      categoryPercentages.find((c) => c.category === hoveredSlice)?.amount || 0
                    )
                  : formatRupee(totalExpenses)}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {hoveredSlice || 'Total Expenses'}
              </span>
            </div>
          </div>

          {/* Legend Column */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-1 gap-2.5">
            {categoryPercentages.map((item) => (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredSlice(item.category)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                  hoveredSlice === item.category ? 'bg-slate-50 font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 truncate font-medium">
                    {item.category}
                  </span>
                </div>
                <span className="font-bold text-slate-900 shrink-0 ml-2">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Trend Bar Chart */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Spending Trend</h2>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            <TrendingUp size={12} />
            <span>Avg {formatRupee(Math.round(totalExpenses / 7))}/day</span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="pt-2">
          {/* Relative chart area with Y-axis markers */}
          <div className="flex">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[10px] font-semibold text-slate-400 pr-3 pb-6 h-36 select-none text-right w-10 shrink-0">
              <span>₹ 5k</span>
              <span>₹ 4k</span>
              <span>₹ 2k</span>
              <span>₹ 1k</span>
              <span>0</span>
            </div>

            {/* Bars Area */}
            <div className="flex-1">
              <div className="h-36 border-b border-slate-100 flex items-end justify-between gap-2 px-1 relative">
                {/* Horizontal reference lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100 pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100 pointer-events-none" />

                {spendingTrends.map((trend) => {
                  const barHeight = Math.max(8, (trend.amount / maxTrend) * chartHeight);
                  const isHovered = hoveredBar?.day === trend.day;

                  return (
                    <div
                      key={trend.day}
                      className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                      onMouseEnter={() => setHoveredBar(trend)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md shadow-lg whitespace-nowrap z-20 pointer-events-none">
                          {formatRupee(trend.amount)}
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        style={{ height: `${barHeight}px` }}
                        className={`w-full max-w-[20px] rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-blue-700 shadow-md scale-y-105 origin-bottom'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis Day Labels */}
              <div className="flex items-center justify-between gap-2 pt-2 px-1">
                {spendingTrends.map((trend) => (
                  <span
                    key={trend.day}
                    className={`flex-1 text-center text-[10px] font-medium transition-colors ${
                      hoveredBar?.day === trend.day
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {trend.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Expenses Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 mb-2">Top Expenses</h2>

        <div className="space-y-3">
          {categoryPercentages.slice(0, 3).map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CategoryIcon category={item.category} size="sm" />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    {item.category}
                  </h3>
                  <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">
                  {formatRupee(item.amount)}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  ({item.percent}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
