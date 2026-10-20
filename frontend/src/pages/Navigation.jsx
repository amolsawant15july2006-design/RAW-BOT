import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import LiveMap from '../components/LiveMap';
import HardwareBridge from '../components/HardwareBridge';
import {
  Navigation as NavIcon,
  Play,
  CheckCircle2,
  Bot,
  MapPin,
  Clock,
  Gauge,
  ArrowRight,
  Route,
  Zap,
  RotateCcw
} from 'lucide-react';

const Navigation = () => {
  const { robots, packages, sendRobotCommand } = useRobot();
  const [selectedPackage, setSelectedPackage] = useState('PKG_A001');
  const [fromLoc, setFromLoc] = useState('Section A');
  const [toLoc, setToLoc] = useState('Section B');
  const [selectedRobot, setSelectedRobot] = useState('RBT-01');
  const [isNavigating, setIsNavigating] = useState(false);

  const activeRobot = robots[selectedRobot] || robots['RBT-01'];

  const handleStartNavigation = () => {
    setIsNavigating(true);
    sendRobotCommand(selectedRobot, 'START', {
      currentLocation: fromLoc,
      destination: toLoc,
      currentTask: `Navigating ${selectedPackage} to ${toLoc}`
    });
    setTimeout(() => {
      setIsNavigating(false);
    }, 12000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Autonomous Navigation & Trajectory Planner
          <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-cyan border border-status-cyan/30">
            A* Path Optimization Engine
          </span>
        </h2>
        <p className="text-xs text-industrial-400 font-mono mt-0.5">
          Dynamic obstacle-aware route generation for Mecanum AGVs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Select Task Navigation Form (Image 2 #7 Left) */}
        <div className="lg:col-span-4 industrial-card p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 pb-2 border-b border-white/5">
              <Route className="w-4 h-4 text-status-cyan" />
              Select Task & Route Parameters
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Package No. or QR Code */}
              <div>
                <label className="text-industrial-400 block mb-1">Package No. or QR Code</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} [QR: {p.qr || p.id}] — Sec {p.section} (Empty Box)
                    </option>
                  ))}
                  <option value="QR-CUSTOM">Scan New QR via ESP32-CAM</option>
                </select>
              </div>

              {/* From Location (Source Section) */}
              <div>
                <label className="text-industrial-400 block mb-1">From Location (Source Section)</label>
                <select
                  value={fromLoc}
                  onChange={(e) => setFromLoc(e.target.value)}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                  <option value="Counter">Counter Pallet (Dispatch)</option>
                  <option value="HOME">HOME (Base Dock)</option>
                </select>
              </div>

              {/* To Destination (Destination Section) */}
              <div>
                <label className="text-industrial-400 block mb-1">To Destination (Target Section)</label>
                <select
                  value={toLoc}
                  onChange={(e) => setToLoc(e.target.value)}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  <option value="Counter">Counter Pallet (Dispatch)</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                  <option value="Section A">Section A</option>
                  <option value="CH01">CH01 (Wireless Charging Dock)</option>
                </select>
              </div>

              {/* AMR Robot Assigned */}
              <div>
                <label className="text-industrial-400 block mb-1">Robot Unit</label>
                <select
                  value={selectedRobot}
                  onChange={(e) => setSelectedRobot(e.target.value)}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  {Object.values(robots).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} ({r.name}) — {r.status} [{r.battery}%]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start Navigation Action Button */}
            <button
              onClick={handleStartNavigation}
              disabled={isNavigating}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isNavigating
                  ? 'bg-status-green/20 text-status-green border border-status-green/40 shadow-glow-green cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-glow-cyan'
              }`}
            >
              {isNavigating ? (
                <>
                  <NavIcon className="w-4 h-4 animate-spin" />
                  <span>Navigating In Progress...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Navigation</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Live Telemetry Box matching Image 2 #7 bottom */}
          <div className="p-3.5 rounded-xl bg-industrial-900 border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-industrial-400">Assigned AMR:</span>
              <span className="text-white font-bold">{activeRobot.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-industrial-400">Navigation Status:</span>
              <span className="text-status-cyan font-bold">
                {isNavigating ? 'NAVIGATING' : activeRobot.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-industrial-400">Calculated ETA:</span>
              <span className="text-status-green font-bold">02:15 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-industrial-400">Speed:</span>
              <span className="text-white">{activeRobot.speed || 0.8} m/s</span>
            </div>
          </div>
        </div>

        {/* Right: Path Preview Visual Grid (Image 2 #7 Right) */}
        <div className="lg:col-span-8 industrial-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                Path Preview & Route Traversal
              </h3>
              <p className="text-xs text-industrial-400 font-mono">
                Waypoint Path: <strong className="text-status-green">{fromLoc}</strong> → <strong className="text-status-cyan">{toLoc}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1 text-status-green font-semibold">
                <span className="w-2 h-2 rounded-full bg-status-green animate-ping"></span>
                Active Path Locked
              </span>
            </div>
          </div>

          <LiveMap
            showPath={true}
            startLocation={fromLoc}
            targetLocation={toLoc}
          />
        </div>
      </div>

      {/* Physical ESP32 Master Teleoperation & 4-Sensor Ultrasonic Radar */}
      <HardwareBridge />
    </div>
  );
};

export default Navigation;
