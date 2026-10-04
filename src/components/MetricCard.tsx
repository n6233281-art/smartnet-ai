import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose';
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtext,
  change,
  isPositive,
  icon: Icon,
  accentColor = 'cyan',
  tooltip
}) => {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'emerald':
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'amber':
        return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'rose':
        return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      case 'blue':
        return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      default:
        return { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
    }
  };

  const accent = getAccentStyles();

  return (
    <div 
      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between relative group"
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`p-2 rounded-lg ${accent.bg} ${accent.text} border ${accent.border}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {(subtext || change) && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
          {change && (
            <span className={`font-mono tabular-nums ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change}
            </span>
          )}
          {change && subtext && <span aria-hidden="true">·</span>}
          {subtext && <span className="truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
