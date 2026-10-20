import React from 'react';
import { useRobot } from '../context/RobotContext';
import { 
  Bot, 
  MapPin, 
  BatteryMedium, 
  Weight, 
  Gauge, 
  Cpu, 
  Play, 
  Pause, 
  AlertOctagon, 
  Zap,
  ArrowUpCircle,
  ArrowDownCircle,
  Wifi,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const RobotStatus = ({ robotId = 'RBT-01' }) => {
  const { robots, sendRobotCommand, triggerEmergencyStop, batterySaverMode, toggleBatterySaverMode } = useRobot();
  const robot = robots[robotId] || robots['RBT-01'];

  if (!robot) return null;

  const isMoving = robot.status === 'Working' || robot.status === 'Moving';
  const isEmergency = robot.status === 'Emergency Stop';
  const isFree = robot.status === 'Idle' || robot.status === 'Completed';
  const isOverweight = robot.weight > 1.0;
  const isLiftUp = robot.lift === 'UP';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/15 p-5 sm:p-6 shadow-industrial-card flex flex-col justify-between h-full transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-cyan/10 border border-status-cyan/30 flex items-center justify-center text-status-cyan shadow-glow-cyan shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-wide font-mono">
                  {robot.id}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-industrial-800 text-industrial-400 border border-white/5">
                  MK-II AGV
                </span>
              </div>
              <p className="text-[11px] text-industrial-400 font-mono">
                {robot.name || 'Primary Autonomous Unit'}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
              isEmergency
                ? 'bg-status-red/15 border-status-red/35 text-status-red shadow-glow-red'
                : isMoving
                ? 'bg-status-green/15 border-status-green/35 text-status-green shadow-glow-green'
                : 'bg-status-cyan/15 border-status-cyan/35 text-status-cyan'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isEmergency ? 'bg-status-red' : isMoving ? 'bg-status-green' : 'bg-status-cyan'
              } animate-pulse`}
            ></span>
            <span>{isFree ? 'FREE' : robot.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Location & Navigation Tile */}
        <div className="p-3 rounded-xl bg-industrial-900/70 border border-white/[0.05]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-industrial-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-status-cyan" />
              Transit Route
            </span>
            <span className="text-[10px] text-status-cyan font-bold uppercase tracking-wider">
              {isMoving ? 'In Motion' : 'Stationary'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.04]">
            <div className="flex flex-col">
              <span className="text-[10px] text-industrial-500 font-mono uppercase">Current Station</span>
              <span className="text-xs font-bold text-white font-mono">{robot.currentLocation || 'Section A'}</span>
            </div>
            <div className="text-industrial-500 text-xs font-mono">➔</div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-industrial-500 font-mono uppercase">Target Station</span>
              <span className="text-xs font-bold text-status-cyan font-mono">{robot.destination || 'Counter'}</span>
            </div>
          </div>
        </div>

        {/* Battery Telemetry Bar */}
        <div className="p-3 rounded-xl bg-industrial-900/70 border border-white/[0.05] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-industrial-400 flex items-center gap-1.5">
              <BatteryMedium className={`w-3.5 h-3.5 ${(robot.battery || 85) < 25 ? 'text-status-red' : 'text-status-green'}`} />
              Battery Telemetry
            </span>
            <span className="text-status-green font-extrabold text-sm">{robot.battery || 85}%</span>
          </div>
          <div className="w-full h-2 bg-industrial-800 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-glow-green"
              style={{ width: `${robot.battery || 85}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-industrial-500 pt-0.5">
            <span>24.2V LiFePO4 Cell</span>
            <span className={batterySaverMode ? "text-status-green font-bold" : "text-status-green font-semibold"}>
              {batterySaverMode ? '🌱 Eco Saver: ~8.2 hrs' : 'Nominal: ~5.4 hrs'}
            </span>
          </div>
        </div>

        {/* Dynamic Weight & Lift Interlock (Prototype Feature: Max 1.0 kg Limit) */}
        <div className="p-3 rounded-xl bg-industrial-900/70 border border-white/[0.05] space-y-2 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-industrial-400 flex items-center gap-1.5">
              <Weight className={`w-3.5 h-3.5 ${isOverweight ? 'text-status-red' : 'text-status-yellow'}`} />
              Lift Load Cell (Max 1.0 kg)
            </span>
            <span className={`font-extrabold text-sm ${isOverweight ? 'text-status-red' : 'text-white'}`}>
              {isLiftUp || robot.weight > 0 ? `${robot.weight} kg` : '0.00 kg'}
            </span>
          </div>

          {/* Safety Interlock Indicator */}
          {isOverweight ? (
            <div className="p-2 rounded-lg bg-status-red/15 border border-status-red/40 flex items-center gap-2 text-status-red text-[11px] animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-bold">ALERT: Package weight &gt; 1 kg! Interlock active.</span>
            </div>
          ) : isLiftUp ? (
            <div className="p-1.5 rounded-lg bg-status-green/10 border border-status-green/30 flex items-center justify-between text-status-green text-[10px]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Empty Box Payload Verified
              </span>
              <span className="font-bold">&le;1.0 kg Safe</span>
            </div>
          ) : (
            <div className="text-[10px] text-industrial-500 flex items-center justify-between">
              <span>Platform clear / Ready for lift</span>
              <span className="text-industrial-400">Limit: 1.00 kg</span>
            </div>
          )}
        </div>

        {/* Actuator & Hardware Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-industrial-900/70 border border-white/[0.05]">
            <span className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
              {isLiftUp ? <ArrowUpCircle className="w-3 h-3 text-status-green" /> : <ArrowDownCircle className="w-3 h-3 text-industrial-400" />}
              Lift Actuator
            </span>
            <span className="text-white font-bold text-xs mt-1 block">
              {isLiftUp ? 'UP (350 mm)' : 'DOWN (50 mm)'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-industrial-900/70 border border-white/[0.05]">
            <span className="text-[10px] text-industrial-500 uppercase flex items-center gap-1">
              <Gauge className="w-3 h-3 text-status-cyan" />
              Drive Speed
            </span>
            <span className="text-status-cyan font-bold text-xs mt-1 block">
              {batterySaverMode ? '0.40 m/s (Eco)' : `${robot.speed || '0.80'} m/s`}
            </span>
          </div>
        </div>
      </div>

      {/* Tactile Control Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.06] mt-4">
        {isMoving ? (
          <button
            onClick={() => sendRobotCommand(robot.id, 'PAUSE')}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-industrial-800 hover:bg-industrial-750 text-status-yellow text-xs font-bold font-mono transition-all border border-status-yellow/30 cursor-pointer shadow-sm"
            title="Pause Autonomous Transit"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={() => sendRobotCommand(robot.id, 'START')}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-status-cyan/15 hover:bg-status-cyan/25 text-status-cyan text-xs font-bold font-mono transition-all border border-status-cyan/35 cursor-pointer shadow-glow-cyan"
            title="Resume Autonomous Mission"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        )}

        <button
          onClick={() => sendRobotCommand(robot.id, 'CHARGE')}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-status-orange/15 hover:bg-status-orange/25 text-status-orange text-xs font-bold font-mono transition-all border border-status-orange/30 cursor-pointer"
          title="Return to Wireless Charging Station CH01"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Dock</span>
        </button>

        <button
          onClick={() => triggerEmergencyStop(robot.id)}
          className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-status-red/20 hover:bg-status-red/35 text-status-red text-xs font-bold font-mono transition-all border border-status-red/40 cursor-pointer shadow-glow-red"
          title="Emergency Stop"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};

export default RobotStatus;
