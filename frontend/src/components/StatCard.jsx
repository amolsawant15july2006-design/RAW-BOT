import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, badge, accent = 'cyan' }) => {
  const accentClasses = {
    cyan: {
      border: 'border-status-cyan/30',
      bg: 'bg-status-cyan/10',
      text: 'text-status-cyan',
      glow: 'shadow-glow-cyan',
      dot: 'bg-status-cyan',
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent'
    },
    green: {
      border: 'border-status-green/30',
      bg: 'bg-status-green/10',
      text: 'text-status-green',
      glow: 'shadow-glow-green',
      dot: 'bg-status-green',
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent'
    },
    yellow: {
      border: 'border-status-yellow/30',
      bg: 'bg-status-yellow/10',
      text: 'text-status-yellow',
      glow: 'shadow-glow-orange',
      dot: 'bg-status-yellow',
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent'
    },
    purple: {
      border: 'border-status-purple/30',
      bg: 'bg-status-purple/10',
      text: 'text-status-purple',
      glow: 'shadow-glow-purple',
      dot: 'bg-status-purple',
      gradient: 'from-purple-500/20 via-purple-500/5 to-transparent'
    },
    red: {
      border: 'border-status-red/30',
      bg: 'bg-status-red/10',
      text: 'text-status-red',
      glow: 'shadow-glow-red',
      dot: 'bg-status-red',
      gradient: 'from-rose-500/20 via-rose-500/5 to-transparent'
    }
  };

  const style = accentClasses[accent] || accentClasses.cyan;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 p-5 sm:p-6 shadow-industrial-card transition-all duration-300 hover:-translate-y-1 group">
      {/* Subtle top ambient gradient aura */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${style.gradient} blur-2xl pointer-events-none transition-all group-hover:scale-125 opacity-70`}></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2 flex-1 min-w-0 pr-2">
          <p className="text-[11px] font-bold text-industrial-400 uppercase tracking-widest font-mono">
            {title}
          </p>

          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {value}
            </h3>
            {badge && (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border} shadow-sm`}>
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-industrial-400 flex items-center gap-2 pt-1 font-mono truncate">
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${style.glow} shrink-0`}></span>
              <span className="truncate">{subtitle}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${style.bg} ${style.border} border ${style.text} transition-transform duration-300 group-hover:scale-110 shadow-lg shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
