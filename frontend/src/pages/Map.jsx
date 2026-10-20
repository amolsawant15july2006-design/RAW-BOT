import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import LiveMap from '../components/LiveMap';
import {
  Compass,
  Bot,
  Package,
  Zap,
  Layers,
  MapPin,
  Maximize2,
  RefreshCw,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Map = () => {
  const { robots, packages, primaryRobot } = useRobot();
  const [selectedNode, setSelectedNode] = useState('Section A');

  const robotList = Object.values(robots || {});

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Warehouse 2D Live Grid Map
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-cyan border border-status-cyan/30">
              Sections A, B, C, D Layout
            </span>
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            Top-down autonomous fleet localization and waypoint monitoring
          </p>
        </div>

        <Link
          to="/navigation"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-status-cyan/20 hover:bg-status-cyan/30 text-status-cyan text-xs font-semibold border border-status-cyan/40 shadow-glow-cyan transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>Go to Navigation Planner</span>
        </Link>
      </div>

      {/* Main Grid Viewport matching Image 2 #6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Grid Canvas (8 cols) */}
        <div className="lg:col-span-8 industrial-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Compass className="w-4 h-4 text-status-cyan" />
              Live Top-Down Coordinate Map
            </h3>
            <span className="text-xs font-mono text-status-green font-semibold">
              ● RT-Sync 10Hz
            </span>
          </div>

          <LiveMap
            interactive={true}
            onSelectNode={(node) => setSelectedNode(node)}
            startLocation={primaryRobot.currentLocation}
            targetLocation={primaryRobot.destination}
          />
        </div>

        {/* Right: Map Telemetry & Legend (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Legend card matching Image 2 #6 */}
          <div className="industrial-card p-5 font-mono text-xs space-y-3">
            <h4 className="text-xs font-bold text-industrial-400 uppercase tracking-wider">
              Map Symbol Legend
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-industrial-900 border border-white/5">
                <div className="w-7 h-7 rounded bg-status-cyan/20 border border-status-cyan/40 flex items-center justify-center text-status-cyan">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Robot Unit</span>
                  <span className="text-[10px] text-industrial-400">AMR moving on warehouse grid</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-industrial-900 border border-white/5">
                <div className="w-7 h-7 rounded bg-status-yellow/20 border border-status-yellow/40 flex items-center justify-center text-status-yellow">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Package / Pallet</span>
                  <span className="text-[10px] text-industrial-400">Stationary cargo at bay</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-industrial-900 border border-white/5">
                <div className="w-7 h-7 rounded bg-status-green/20 border border-status-green/40 flex items-center justify-center text-status-green">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Charging Station</span>
                  <span className="text-[10px] text-industrial-400">Dock CH01 Inductive pad</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-industrial-900 border border-white/5">
                <div className="w-7 h-7 rounded bg-industrial-750 border border-white/10 flex items-center justify-center text-industrial-300">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-white font-bold block">Warehouse Section</span>
                  <span className="text-[10px] text-industrial-400">Bay rack columns A, B, C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Robot Coordinates Feed */}
          <div className="industrial-card p-5 font-mono text-xs space-y-3">
            <h4 className="text-xs font-bold text-industrial-400 uppercase tracking-wider">
              Fleet Localization Feed
            </h4>
            <div className="space-y-2">
              {robotList.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-lg bg-industrial-900 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-status-cyan" />
                    <div>
                      <span className="text-white font-bold block">{r.id}</span>
                      <span className="text-[10px] text-industrial-400">{r.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-industrial-750 text-status-cyan font-bold border border-white/5">
                      {r.currentLocation}
                    </span>
                    <span className="text-[10px] text-industrial-400 block mt-0.5">{r.battery}% Bat</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
