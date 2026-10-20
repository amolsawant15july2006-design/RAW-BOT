import React from 'react';
import { useRobot } from '../context/RobotContext';
import { Zap, Radio } from 'lucide-react';

const WarehouseMap = ({ activeRobotId = 'RBT-01' }) => {
  const { robots } = useRobot();
  const robot = robots[activeRobotId] || robots['RBT-01'];
  const currentLocation = robot?.currentLocation || 'Section A';
  const destination = robot?.destination || 'Counter';

  // 1 Main Central Line with 3 Horizontal Branches at RFID 1, RFID 2, RFID 3
  const nodes = [
    // Tier 1 (RFID 1 Junction): Left = Section A, Right = Section B
    { id: 'Section A', x: 55, y: 50, label: 'SEC A', code: 'A' },
    { id: 'RFID 1', x: 175, y: 50, label: 'RFID 1', isRfid: true },
    { id: 'Section B', x: 295, y: 50, label: 'SEC B', code: 'B' },

    // Tier 2 (RFID 2 Junction): Left = Section C, Right = Section D
    { id: 'Section C', x: 55, y: 130, label: 'SEC C', code: 'C' },
    { id: 'RFID 2', x: 175, y: 130, label: 'RFID 2', isRfid: true },
    { id: 'Section D', x: 295, y: 130, label: 'SEC D', code: 'D' },

    // Tier 3 (RFID 3 Junction): Left = Counter, Right = Charging Dock
    { id: 'Counter', x: 55, y: 210, label: 'COUNTER', code: 'CTR' },
    { id: 'RFID 3', x: 175, y: 210, label: 'RFID 3', isRfid: true },
    { id: 'CH01', x: 295, y: 210, label: 'CH01', isCharge: true }
  ];

  const connections = [
    // Central Main Line Spine
    ['RFID 1', 'RFID 2'],
    ['RFID 2', 'RFID 3'],

    // Horizontal Branch Line 1 (RFID 1)
    ['Section A', 'RFID 1'],
    ['RFID 1', 'Section B'],

    // Horizontal Branch Line 2 (RFID 2)
    ['Section C', 'RFID 2'],
    ['RFID 2', 'Section D'],

    // Horizontal Branch Line 3 (RFID 3)
    ['Counter', 'RFID 3'],
    ['RFID 3', 'CH01']
  ];

  const getNode = (id) => {
    if (!id) return null;
    return nodes.find(n => 
      n.id === id || 
      n.label === id || 
      n.code === id || 
      (id.toLowerCase().includes('counter') && n.id === 'Counter') ||
      (id.includes('Section A') && n.code === 'A') ||
      (id.includes('Section B') && n.code === 'B') ||
      (id.includes('Section C') && n.code === 'C') ||
      (id.includes('Section D') && n.code === 'D')
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/15 p-5 sm:p-6 shadow-industrial-card flex flex-col justify-between h-full transition-all duration-300">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <h3 className="text-sm font-extrabold text-white tracking-wide font-mono flex items-center gap-2">
          Warehouse Track Map
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-cyan/15 text-status-cyan border border-status-cyan/30">
            1 Main Line • 3 RFID Junctions
          </span>
        </h3>
        <span className="text-xs font-mono text-industrial-400">
          Robot {robot?.id || 'RBT-01'}: <strong className="text-status-green">{currentLocation}</strong> ➔ <strong className="text-status-cyan">{destination}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* SVG Network Map */}
        <div className="md:col-span-3 w-full bg-industrial-900/90 rounded-xl p-3 border border-white/5 relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 350 260" className="w-full max-h-56">
            {/* CENTRAL MAIN BLACK LINE (Vertical Track) */}
            <line x1="175" y1="25" x2="175" y2="235" stroke="#05070a" strokeWidth="8" />
            <line x1="175" y1="25" x2="175" y2="235" stroke="#00e5ff" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

            {/* HORIZONTAL BLACK CROSS TRACKS */}
            <line x1="55" y1="50" x2="295" y2="50" stroke="#05070a" strokeWidth="6" />
            <line x1="55" y1="50" x2="295" y2="50" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

            <line x1="55" y1="130" x2="295" y2="130" stroke="#05070a" strokeWidth="6" />
            <line x1="55" y1="130" x2="295" y2="130" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

            <line x1="55" y1="210" x2="295" y2="210" stroke="#05070a" strokeWidth="6" />
            <line x1="55" y1="210" x2="295" y2="210" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

            {/* Active Green Trajectory Route Line */}
            {(() => {
              const start = getNode(currentLocation);
              const end = getNode(destination);
              if (start && end) {
                return (
                  <path
                    d={`M ${start.x} ${start.y} L 175 ${start.y} L 175 ${end.y} L ${end.x} ${end.y}`}
                    stroke="#10b981"
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray="6 3"
                    className="animate-pulse"
                  />
                );
              }
              return null;
            })()}

            {/* Nodes & RFID Junctions */}
            {nodes.map((node) => {
              const isCurrent = node.id === currentLocation;
              const isDest = node.id === destination;
              const isCharge = node.isCharge;
              const isRfid = node.isRfid;

              // RFID Checkpoint Junctions on Main Line
              if (isRfid) {
                return (
                  <g key={node.id} className="cursor-pointer">
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      fill="#11161d"
                      stroke="#00e5ff"
                      strokeWidth="2"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="12"
                      fill="#00e5ff"
                      opacity="0.15"
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill="#00e5ff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              }

              let fill = '#151b23';
              let stroke = '#3d4a5e';
              let textColor = '#bac4d0';

              if (isCurrent) {
                fill = '#10b981';
                stroke = '#00ff66';
                textColor = '#ffffff';
              } else if (isDest) {
                fill = '#0284c7';
                stroke = '#00e5ff';
                textColor = '#ffffff';
              } else if (isCharge) {
                fill = '#11161d';
                stroke = '#10b981';
                textColor = '#10b981';
              }

              return (
                <g key={node.id} className="cursor-pointer transition-transform hover:scale-110">
                  <rect
                    x={node.x - 22}
                    y={node.y - 14}
                    width="44"
                    height="28"
                    rx="6"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isCurrent || isDest ? '2.5' : '1.5'}
                    className={isCurrent ? 'filter drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill={textColor}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y - 20}
                      r="4"
                      fill="#00ff66"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="md:col-span-1 space-y-2.5 bg-industrial-850/80 p-3 rounded-xl border border-white/5 text-xs font-mono">
          <p className="text-industrial-400 font-bold uppercase tracking-wider text-[10px]">Track Legend</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-status-cyan bg-status-cyan/20 flex items-center justify-center text-[8px] text-status-cyan font-bold shrink-0">
              R
            </span>
            <span className="text-white text-[11px]">RFID Checkpoint</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-status-green shadow-glow-green shrink-0"></span>
            <span className="text-white text-[11px]">Robot Location</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-status-green shrink-0"></span>
            <span className="text-industrial-300 text-[11px]">Spine Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-sky-600 shrink-0"></span>
            <span className="text-industrial-300 text-[11px]">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded border border-status-green flex items-center justify-center text-[9px] text-status-green font-bold shrink-0">
              ⚡
            </span>
            <span className="text-industrial-300 text-[11px]">Dock CH01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseMap;
