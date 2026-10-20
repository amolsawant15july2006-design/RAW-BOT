import React from 'react';
import { useRobot } from '../context/RobotContext';
import { BatteryCharging, Zap, Thermometer, ShieldCheck, Leaf } from 'lucide-react';

const BatteryLevelsChart = () => {
  const { robots, primaryRobot, batterySaverMode, toggleBatterySaverMode } = useRobot();
  const battery = Math.round(primaryRobot?.battery || 85);

  const getBarColor = (val) => {
    if (batterySaverMode) return 'from-emerald-400 via-teal-400 to-green-300';
    if (val > 65) return 'from-emerald-500 to-green-400';
    if (val > 30) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  const isCharging = primaryRobot?.status === 'Charging';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/15 p-5 sm:p-6 shadow-industrial-card flex flex-col justify-between h-full transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
              batterySaverMode 
                ? 'bg-status-green/20 border-status-green/40 text-status-green shadow-glow-green' 
                : 'bg-status-green/10 border-status-green/30 text-status-green shadow-glow-green'
            }`}>
              {batterySaverMode ? <Leaf className="w-5 h-5 animate-pulse" /> : <BatteryCharging className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide font-mono">
                Battery Health
              </h3>
              <p className="text-[11px] text-industrial-400 font-mono">
                24V LiFePO4 Power Pack
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
            batterySaverMode 
              ? 'bg-status-green/20 text-status-green border-status-green/40 shadow-glow-green' 
              : isCharging 
              ? 'bg-status-orange/15 text-status-orange border-status-orange/30' 
              : 'bg-status-green/15 text-status-green border-status-green/30'
          }`}>
            {batterySaverMode ? 'ECO ACTIVE' : isCharging ? 'Charging' : 'Optimal'}
          </span>
        </div>

        {/* Big Percentage & Circular Metric Display */}
        <div className="p-4 rounded-xl bg-industrial-900/80 border border-white/[0.05] text-center space-y-2">
          <span className="text-[10px] font-mono uppercase text-industrial-400 tracking-wider">
            RBT-01 State of Charge
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {battery}
            </span>
            <span className="text-lg font-mono text-status-green font-bold">%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-industrial-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getBarColor(battery)} shadow-glow-green transition-all duration-500`}
              style={{ width: `${battery}%` }}
            />
          </div>

          <p className="text-[11px] text-industrial-400 font-mono pt-1">
            {batterySaverMode 
              ? '🌱 Eco Saver: Approx. 8.2 hrs runtime remaining (+50%)' 
              : '⚡ Nominal: Approx. 5.4 hrs runtime remaining'}
          </p>
        </div>

        {/* BATTERY SAVER OPTION INTERACTIVE TOGGLE CARD */}
        <div className={`p-3.5 rounded-xl border transition-all duration-300 font-mono ${
          batterySaverMode 
            ? 'bg-status-green/15 border-status-green/40 shadow-glow-green' 
            : 'bg-industrial-900/70 border-white/[0.06] hover:border-white/15'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
                batterySaverMode 
                  ? 'bg-status-green/20 border-status-green/40 text-status-green' 
                  : 'bg-industrial-800 border-white/10 text-industrial-400'
              }`}>
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Battery Saver (Eco)</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    batterySaverMode 
                      ? 'bg-status-green/20 text-status-green border-status-green/40' 
                      : 'bg-industrial-800 text-industrial-400 border-white/5'
                  }`}>
                    {batterySaverMode ? '0.4 m/s' : '0.8 m/s'}
                  </span>
                </div>
                <p className="text-[10px] text-industrial-400 mt-0.5">
                  {batterySaverMode 
                    ? 'Speed limited to 0.4 m/s • Current draw reduced by 50%' 
                    : 'Throttle speed to 0.4 m/s to extend runtime to ~8.2 hrs'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleBatterySaverMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ml-2 ${
                batterySaverMode ? 'bg-status-green shadow-glow-green' : 'bg-industrial-700'
              }`}
              title={batterySaverMode ? 'Disable Battery Saver Mode' : 'Enable Battery Saver Mode'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  batterySaverMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Electrical Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-industrial-900/70 border border-white/[0.05]">
            <span className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-status-yellow" />
              Bus Voltage
            </span>
            <span className="text-white font-bold text-xs mt-1 block">
              {batterySaverMode ? '24.4 V DC (Eco)' : '24.2 V DC'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-industrial-900/70 border border-white/[0.05]">
            <span className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-status-cyan" />
              Pack Temp
            </span>
            <span className="text-status-cyan font-bold text-xs mt-1 block">
              {batterySaverMode ? '26.8 °C (Cooler)' : '28.4 °C'}
            </span>
          </div>
        </div>
      </div>

      {/* Docking Station Info */}
      <div className="pt-3 border-t border-white/[0.06] mt-4 flex items-center justify-between text-[11px] font-mono text-industrial-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-status-green" />
          BMS Safety Interlock
        </span>
        <span className="text-industrial-300 font-bold">Dock CH01</span>
      </div>
    </div>
  );
};

export default BatteryLevelsChart;
