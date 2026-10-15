import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  badge,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#eae7e1] p-3.5 sm:p-4.5 lg:p-5 shadow-2xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#d9d5ce] hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 font-medium gap-2">
        <span className="truncate">{label}</span>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {badge}
          {Icon && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#faf9f6] border border-[#eae7e1] flex items-center justify-center text-[#181716]">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3">
        <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#181716] tracking-tight tnum truncate">
          {value}
        </div>

        {(subValue || trend) && (
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs">
            {trend && (
              <span
                className={`font-semibold shrink-0 ${
                  trend.isPositive ? 'text-emerald-700' : 'text-zinc-600'
                }`}
              >
                {trend.value}
              </span>
            )}
            {subValue && <span className="text-zinc-500 font-medium truncate">{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
