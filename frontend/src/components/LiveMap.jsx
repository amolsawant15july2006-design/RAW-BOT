import React from 'react';
import { useRobot } from '../context/RobotContext';
import { Bot, Package, Zap, Navigation, Compass, Radio } from 'lucide-react';

const LiveMap = ({ 
  showPath = false, 
  startLocation = 'Section A', 
  targetLocation = 'Section B',
  interactive = false,
  onSelectNode = null
}) => {
  const { robots, packages } = useRobot();

  const isMatching = (loc, target) => {
    if (!loc || !target) return false;
    if (loc === target) return true;
    if (loc.toLowerCase().includes('counter') && target.toLowerCase().includes('counter')) return true;
    if (loc.includes('A') && target.includes('A') && !loc.includes('Counter') && !target.includes('Counter')) return true;
    if (loc.includes('B') && target.includes('B')) return true;
    if (loc.includes('C') && target.includes('C') && !loc.includes('Counter') && !target.includes('Counter')) return true;
    if (loc.includes('D') && target.includes('D')) return true;
    if (loc.includes('CH01') && target.includes('CH01')) return true;
    return false;
  };

  // 3 Tiers along the Main Black Line
  const tiers = [
    {
      rfid: 'RFID 1',
      rfidName: 'Checkpoint 1 (Sec A / Sec B)',
      left: { id: 'Section A', code: 'A', name: 'Section A', rfidReader: 'RC522-SEC-A', color: 'border-cyan-500/40 text-cyan-400' },
      right: { id: 'Section B', code: 'B', name: 'Section B', rfidReader: 'RC522-SEC-B', color: 'border-amber-500/40 text-amber-400' }
    },
    {
      rfid: 'RFID 2',
      rfidName: 'Checkpoint 2 (Sec C / Sec D)',
      left: { id: 'Section C', code: 'C', name: 'Section C', rfidReader: 'RC522-SEC-C', color: 'border-emerald-500/40 text-emerald-400' },
      right: { id: 'Section D', code: 'D', name: 'Section D', rfidReader: 'RC522-SEC-D', color: 'border-purple-500/40 text-purple-400' }
    },
    {
      rfid: 'RFID 3',
      rfidName: 'Checkpoint 3 (Counter / Dock)',
      left: { id: 'Counter', code: 'CTR', name: 'Counter Pallet', rfidReader: 'RC522-COUNTER', color: 'border-amber-500/40 text-amber-400' },
      right: { id: 'CH01', code: 'CH01', name: 'CH01 Charging Dock', rfidReader: 'CH01-INDUCTION', isCharge: true, color: 'border-emerald-500/40 text-emerald-400' }
    }
  ];

  const renderStationCard = (sec) => {
    const isStart = isMatching(sec.id, startLocation);
    const isTarget = isMatching(sec.id, targetLocation);

    const cellRobots = Object.values(robots || {}).filter(
      (rob) => isMatching(rob.currentLocation, sec.id)
    );

    const cellPackage = packages?.find(
      (pkg) => (pkg.section === sec.code || isMatching(pkg.location, sec.id)) && pkg.status !== 'DELIVERED'
    );

    return (
      <div
        key={sec.id}
        onClick={() => onSelectNode && onSelectNode(sec.id)}
        className={`flex-1 min-h-[135px] rounded-2xl border relative flex flex-col justify-between p-3.5 transition-all ${
          interactive ? 'cursor-pointer hover:border-status-cyan/60 hover:bg-industrial-800/70' : ''
        } ${
          isStart
            ? 'border-status-green/60 bg-status-green/10 shadow-glow-green'
            : isTarget
            ? 'border-status-cyan/60 bg-status-cyan/10 shadow-glow-cyan'
            : 'border-white/10 bg-industrial-850/80'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-industrial-800 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
              {sec.code}
            </span>
            <div>
              <h4 className="font-bold text-white text-xs">{sec.name}</h4>
              <span className="text-[10px] text-industrial-400 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-status-cyan" /> {sec.rfidReader}
              </span>
            </div>
          </div>

          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
              sec.isCharge
                ? 'bg-status-green/15 text-status-green border-status-green/30'
                : cellPackage
                ? 'bg-status-cyan/15 text-status-cyan border-status-cyan/30'
                : 'bg-black/30 text-industrial-500 border-white/5'
            }`}
          >
            {sec.isCharge ? 'CHARGER' : cellPackage ? 'OCCUPIED' : 'READY'}
          </span>
        </div>

        {/* Center */}
        <div className="py-2 flex items-center justify-center">
          {sec.isCharge ? (
            <div className="flex items-center gap-2 text-xs font-mono text-status-green">
              <Zap className="w-4 h-4 text-status-green animate-pulse" />
              <span>Wireless Inductive Pad (Active)</span>
            </div>
          ) : cellPackage ? (
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-status-cyan/10 border border-status-cyan/30 text-white font-mono text-xs w-full justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-industrial-900" />
                </div>
                <div className="text-[11px]">
                  <span className="font-bold block text-status-cyan">{cellPackage.id}</span>
                  <span className="text-[9px] text-industrial-400">Empty Box Payload</span>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-status-green/20 text-status-green font-bold">
                OK
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-industrial-500">
              Empty Pallet Stand
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {cellRobots.length > 0 ? (
              cellRobots.map((rob) => (
                <span
                  key={rob.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-green/20 border border-status-green/40 text-status-green font-bold shadow-glow-green animate-pulse"
                >
                  <Bot className="w-3 h-3" />
                  {rob.id}
                </span>
              ))
            ) : (
              <span className="text-industrial-600">No AGV at bay</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isStart && <span className="text-status-green font-bold px-1.5 py-0.5 bg-status-green/20 rounded">PICKUP</span>}
            {isTarget && <span className="text-status-cyan font-bold px-1.5 py-0.5 bg-status-cyan/20 rounded">DROP</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full bg-industrial-950 rounded-2xl border border-white/[0.08] p-5 overflow-hidden">
      {/* Compass / Orientation */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Track Blueprint: 1 Central Main Line with 3 RFID Branch Tiers
            <span className="w-2 h-2 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-industrial-900 border border-white/10 text-xs font-mono text-industrial-300">
          <Compass className="w-3.5 h-3.5 text-status-cyan" />
          <span>North Aligned Grid</span>
        </div>
      </div>

      {/* 3 Tiers Layout along the Central Spine */}
      <div className="relative max-w-4xl mx-auto space-y-6">
        {/* Central Vertical Spine Line Graphic */}
        <div className="absolute left-1/2 top-0 bottom-0 w-2.5 -translate-x-1/2 bg-industrial-900 border-x border-status-cyan/40 shadow-glow-cyan pointer-events-none z-0"></div>

        {tiers.map((tier, idx) => (
          <div key={tier.rfid} className="relative z-10">
            {/* Horizontal Cross Line Background */}
            <div className="flex items-center gap-4">
              {/* Left Station */}
              {renderStationCard(tier.left)}

              {/* Center RFID Checkpoint Tag on the Main Line */}
              <div className="w-28 shrink-0 flex flex-col items-center justify-center p-2 rounded-xl bg-industrial-900 border-2 border-status-cyan shadow-glow-cyan font-mono text-center z-10">
                <span className="text-[11px] font-extrabold text-status-cyan block">
                  {tier.rfid}
                </span>
                <span className="text-[8px] text-industrial-400 uppercase tracking-tighter mt-0.5">
                  MAIN LINE
                </span>
              </div>

              {/* Right Station */}
              {renderStationCard(tier.right)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Track Summary */}
      <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-industrial-400">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold">1 Main Black Line</span>
          <span>• RFID 1: Sec A / Sec B</span>
          <span>• RFID 2: Sec C / Sec D</span>
          <span>• RFID 3: Counter / CH01 Dock</span>
        </div>
        <span className="text-status-cyan font-bold">Line Following Active</span>
      </div>
    </div>
  );
};

export default LiveMap;
