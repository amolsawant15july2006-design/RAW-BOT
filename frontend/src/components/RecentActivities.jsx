import React from 'react';
import { Activity, Clock } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      time: '10:30 AM',
      title: 'Mission TSK-0101 started (RBT-01)',
      subtitle: 'Pickup: Section C ➔ Drop: Counter',
      color: 'bg-status-green',
      glow: 'shadow-glow-green'
    },
    {
      time: '10:32 AM',
      title: 'RBT-01 docked at Section C',
      subtitle: 'Station locked • RC522 RFID tag PAL-001 OK',
      color: 'bg-status-cyan',
      glow: 'shadow-glow-cyan'
    },
    {
      time: '10:33 AM',
      title: 'Empty box package verified',
      subtitle: 'Load cell: 0.20 kg (≤1.0 kg safety limit OK)',
      color: 'bg-status-green',
      highlight: true
    },
    {
      time: '10:34 AM',
      title: 'Pallet lifted successfully',
      subtitle: 'Linear actuator elevated to 350mm',
      color: 'bg-status-cyan'
    },
    {
      time: '10:35 AM',
      title: 'RBT-01 en route to Counter',
      subtitle: 'Autonomous navigation active • Speed 0.45 m/s',
      color: 'bg-status-green',
      glow: 'shadow-glow-green'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/15 p-5 sm:p-6 shadow-industrial-card flex flex-col justify-between h-full transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-cyan/10 border border-status-cyan/30 flex items-center justify-center text-status-cyan shadow-glow-cyan shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide font-mono">
                Recent Activities
              </h3>
              <p className="text-[11px] text-industrial-400 font-mono">
                Live Autonomous Event Stream
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-status-cyan/15 text-status-cyan border border-status-cyan/30 uppercase tracking-wider">
            Live Feed
          </span>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 space-y-3.5 pt-1">
          {/* Continuous gradient line */}
          <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>

          {activities.map((act, index) => (
            <div key={index} className="relative flex items-start gap-3 group">
              {/* Timeline node dot */}
              <div
                className={`absolute -left-[19px] mt-1 w-2.5 h-2.5 rounded-full ${act.color} ${
                  act.glow ? act.glow : ''
                } border border-industrial-950 transition-transform group-hover:scale-125`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px] font-mono text-industrial-500 font-semibold">{act.time}</span>
                  <span className="text-xs font-bold text-white truncate font-mono">{act.title}</span>
                </div>
                <p
                  className={`text-[11px] font-mono mt-0.5 truncate ${
                    act.highlight ? 'text-status-green font-bold' : 'text-industrial-400'
                  }`}
                >
                  {act.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.06] mt-4 flex items-center justify-between text-[11px] font-mono text-industrial-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-industrial-500" />
          Auto-synchronized with ESP32
        </span>
        <span className="text-status-cyan font-bold">100 Hz</span>
      </div>
    </div>
  );
};

export default RecentActivities;
