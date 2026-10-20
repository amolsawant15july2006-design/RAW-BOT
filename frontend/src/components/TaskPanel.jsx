import React from 'react';
import { Link } from 'react-router-dom';
import { useRobot } from '../context/RobotContext';
import { ArrowRight, QrCode, Clock, CheckCircle2, ChevronRight, PackageCheck, Truck, Layers } from 'lucide-react';

const TaskPanel = () => {
  const { tasks, primaryRobot } = useRobot();
  const activeTask = tasks.find((t) => t.status === 'In Progress') || tasks[0];

  const steps = [
    'Select',
    'Find',
    'Assign',
    'Navigate',
    'Pickup',
    'Transport',
    'Drop',
    'Done'
  ];

  // Map progress (0-100) to current step index
  const currentStepIdx = activeTask ? Math.min(7, Math.floor((activeTask.progress || 60) / 13)) : 5;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/15 p-5 sm:p-6 shadow-industrial-card flex flex-col justify-between h-full transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-purple/10 border border-status-purple/30 flex items-center justify-center text-status-purple shadow-glow-purple shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide font-mono">
                Active Mission
              </h3>
              <p className="text-[11px] text-industrial-400 font-mono">
                Warehouse Dispatch Task
              </p>
            </div>
          </div>

          {activeTask && (
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-status-green/15 text-status-green border border-status-green/30 uppercase tracking-wider flex items-center gap-1.5 shadow-glow-green">
              <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse"></span>
              {activeTask.status}
            </span>
          )}
        </div>

        {activeTask ? (
          <div className="space-y-3.5">
            {/* Task ID & Pallet QR code Tile */}
            <div className="flex items-center justify-between bg-industrial-900/80 p-3.5 rounded-xl border border-white/[0.05]">
              <div className="space-y-1.5 min-w-0 pr-2">
                <span className="text-[10px] text-industrial-500 font-mono uppercase tracking-wider block">Mission ID</span>
                <span className="text-base font-extrabold text-white font-mono">{activeTask.id}</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-industrial-400 font-mono">Target:</span>
                  <span className="text-xs font-bold text-status-cyan font-mono">{activeTask.packageNo || 'PAL-001'}</span>
                </div>
              </div>

              {/* QR Code Graphic Box */}
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white text-black shadow-lg shrink-0">
                <QrCode className="w-9 h-9" />
                <span className="text-[8px] font-mono font-extrabold mt-0.5 tracking-tighter">RFID-01</span>
              </div>
            </div>

            {/* Pickup -> Drop Route Info */}
            <div className="p-3 bg-industrial-900/70 rounded-xl border border-white/[0.05] flex items-center justify-between font-mono">
              <div>
                <span className="text-[10px] text-industrial-500 uppercase block">Pickup</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{activeTask.from}</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <div className="w-7 h-7 rounded-full bg-status-cyan/10 border border-status-cyan/30 flex items-center justify-center text-status-cyan shadow-glow-cyan">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] text-industrial-500 mt-1">TRANSIT</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-industrial-500 uppercase block">Destination</span>
                <span className="text-xs font-bold text-status-green mt-0.5 block">{activeTask.to}</span>
              </div>
            </div>

            {/* Time Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-industrial-900/70 border border-white/[0.05]">
                <span className="text-[10px] text-industrial-500 uppercase block">Started At</span>
                <span className="text-white font-semibold flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-industrial-400" />
                  {activeTask.time}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-industrial-900/70 border border-white/[0.05] text-right">
                <span className="text-[10px] text-industrial-500 uppercase block">Estimated ETA</span>
                <span className="text-status-cyan font-bold flex items-center justify-end gap-1.5 mt-1">
                  <Truck className="w-3.5 h-3.5 text-status-cyan" />
                  {activeTask.eta}
                </span>
              </div>
            </div>

            {/* Visual Task Pipeline */}
            <div className="p-3 rounded-xl bg-industrial-900/70 border border-white/[0.05] space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-industrial-400 uppercase tracking-wider">Mission Pipeline</span>
                <span className="text-status-cyan font-bold font-mono">{activeTask.progress || 65}%</span>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {steps.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurr = idx === currentStepIdx;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-full h-1.5 rounded-full transition-all ${
                          isDone
                            ? 'bg-status-green shadow-glow-green'
                            : isCurr
                            ? 'bg-status-cyan shadow-glow-cyan animate-pulse'
                            : 'bg-industrial-800'
                        }`}
                        title={step}
                      />
                      <span className={`text-[8px] font-mono truncate mt-1 ${isCurr ? 'text-status-cyan font-bold' : isDone ? 'text-industrial-300' : 'text-industrial-600'}`}>
                        {step.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-industrial-500 font-mono">
            No mission currently assigned.
          </div>
        )}
      </div>

      {/* Button link */}
      <div className="pt-4 border-t border-white/[0.06] mt-4">
        <Link
          to="/tasks"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs font-mono transition-all shadow-glow-cyan"
        >
          <span>View Task Details</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default TaskPanel;
