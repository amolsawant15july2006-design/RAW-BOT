import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import { useAuth } from '../context/AuthContext';
import Robot3D from '../components/Robot3D';
import {
  Bot,
  Search,
  Plus,
  Play,
  Pause,
  AlertOctagon,
  Zap,
  BatteryMedium,
  MapPin,
  Eye,
  X,
  Gauge,
  Cpu,
  Layers,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Shield
} from 'lucide-react';

const Robot = () => {
  const { robots, sendRobotCommand, triggerEmergencyStop } = useRobot();
  const { isAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adminNotice, setAdminNotice] = useState(false);
  const [newRobotData, setNewRobotData] = useState({ id: '', name: '', location: 'HOME', battery: 100 });

  const robotList = Object.values(robots || {});

  const filteredRobots = robotList.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.currentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'working':
      case 'moving':
        return 'bg-status-green/15 text-status-green border-status-green/30';
      case 'charging':
        return 'bg-status-orange/15 text-status-orange border-status-orange/30';
      case 'emergency stop':
        return 'bg-status-red/15 text-status-red border-status-red/30 animate-pulse';
      default:
        return 'bg-industrial-700 text-industrial-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Header (Image 2 #2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Robot Fleet Management
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-cyan border border-status-cyan/30">
              {robotList.length} Active Autonomous Unit{robotList.length === 1 ? '' : 's'}
            </span>
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            Real-time Mecanum AMR Fleet Telemetry & Remote Actuation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search robot ID, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-industrial-850 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-industrial-500 focus:outline-none focus:border-status-cyan font-mono w-56 sm:w-64"
            />
          </div>

          {/* Add Robot Button (Admin Only per requirements) */}
          <button
            onClick={() => {
              if (isAdmin) {
                setShowAddModal(true);
              } else {
                setAdminNotice(true);
                setTimeout(() => setAdminNotice(false), 3500);
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isAdmin
                ? 'bg-status-cyan/20 hover:bg-status-cyan/30 text-status-cyan border border-status-cyan/40 shadow-glow-cyan'
                : 'bg-industrial-800 text-industrial-400 border border-white/5 hover:text-white'
            }`}
            title={isAdmin ? 'Add New Robot' : 'Admin Role Required'}
          >
            <Plus className="w-4 h-4" />
            <span>Add Robot</span>
            {!isAdmin && <span className="text-[9px] text-industrial-500 font-mono">(Admin)</span>}
          </button>
        </div>
      </div>

      {adminNotice && (
        <div className="p-3 rounded-xl bg-status-yellow/15 border border-status-yellow/30 text-status-yellow text-xs font-mono flex items-center justify-between animate-fade-in">
          <span>⚠️ Access Restricted: Only Admin (Boss) has permission to add or provision new AMR units. Current role: {user?.role}.</span>
          <button onClick={() => setAdminNotice(false)} className="text-industrial-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Fleet Table matching Image 2 #2 */}
      <div className="industrial-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-industrial-900/80 text-[11px] font-mono text-industrial-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Battery</th>
                <th className="py-3.5 px-4">Current Task</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {filteredRobots.map((rob) => (
                <tr key={rob.id} className="hover:bg-industrial-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-status-cyan" />
                    {rob.id}
                  </td>
                  <td className="py-4 px-4 text-industrial-200">{rob.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(rob.status)}`}>
                      ● {rob.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-industrial-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                          style={{ width: `${rob.battery}%` }}
                        />
                      </div>
                      <span className="text-industrial-300 font-bold">{rob.battery}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-industrial-300">{rob.currentTask || 'Idle / Standby'}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-industrial-750 text-white font-bold border border-white/5">
                      {rob.currentLocation}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedRobot(rob)}
                      className="px-3 py-1.5 rounded-lg bg-industrial-750 hover:bg-status-cyan/20 hover:text-status-cyan hover:border-status-cyan/40 text-white text-xs font-semibold border border-white/10 transition-all inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED ROBOT MODAL / VIEW (Image 2 #2 & Requirement #11) */}
      {selectedRobot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-industrial-850 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedRobot(null)}
              className="absolute top-4 right-4 p-2 text-industrial-400 hover:text-white rounded-lg bg-industrial-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-status-cyan/15 border border-status-cyan/40 flex items-center justify-center text-status-cyan shadow-glow-cyan font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Robot {selectedRobot.id} Detailed Telemetry
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(selectedRobot.status)}`}>
                    {selectedRobot.status}
                  </span>
                </h3>
                <p className="text-xs text-industrial-400 font-mono">
                  Mecanum Autonomous Mobile Robot • Firmware v2.4 ESP32 Connected
                </p>
              </div>
            </div>

            {/* 3D Robot Canvas in Modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-industrial-900">
                <Robot3D
                  status={selectedRobot.status}
                  lift={selectedRobot.lift}
                  height="280px"
                  autoRotate={true}
                  interactive={true}
                />
              </div>

              {/* Real-time Diagnostics */}
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-industrial-900 border border-white/5">
                    <span className="text-industrial-400 text-[10px] uppercase block">Battery Level</span>
                    <span className="text-lg font-bold text-status-green">{selectedRobot.battery}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-industrial-900 border border-white/5">
                    <span className="text-industrial-400 text-[10px] uppercase block">Payload Weight</span>
                    <span className="text-lg font-bold text-status-yellow">{selectedRobot.weight || 0.72} kg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-industrial-900 border border-white/5">
                    <span className="text-industrial-400 text-[10px] uppercase block">Current Location</span>
                    <span className="text-lg font-bold text-white">{selectedRobot.currentLocation}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-industrial-900 border border-white/5">
                    <span className="text-industrial-400 text-[10px] uppercase block">Destination</span>
                    <span className="text-lg font-bold text-status-cyan">{selectedRobot.destination || 'Section B'}</span>
                  </div>
                </div>

                {/* Hardware Sensors Diagnostics */}
                <div className="p-3 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
                  <p className="text-industrial-400 text-[10px] font-bold uppercase tracking-wider">
                    ESP32 Sensor Array & Actuators
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-industrial-400">Ultrasonic Front:</span>
                      <span className="text-status-cyan">{selectedRobot.sensors?.ultrasonic || 45} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-400">RFID Tag:</span>
                      <span className="text-white">{selectedRobot.sensors?.rfid || 'SEC-A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-400">QR Camera:</span>
                      <span className="text-status-green">{selectedRobot.sensors?.qrCamera || 'OK'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-industrial-400">Lift Actuator:</span>
                      <span className="text-status-yellow">{selectedRobot.lift || 'UP'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remote Command Deck */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => sendRobotCommand(selectedRobot.id, 'START')}
                  className="px-3 py-2 rounded-lg bg-status-cyan/20 hover:bg-status-cyan/30 text-status-cyan border border-status-cyan/40 text-xs font-bold transition-all shadow-glow-cyan flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Start / Resume
                </button>
                <button
                  onClick={() => sendRobotCommand(selectedRobot.id, 'PAUSE')}
                  className="px-3 py-2 rounded-lg bg-industrial-750 hover:bg-industrial-700 text-status-yellow border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
                <button
                  onClick={() => sendRobotCommand(selectedRobot.id, 'CHARGE')}
                  className="px-3 py-2 rounded-lg bg-status-orange/20 hover:bg-status-orange/30 text-status-orange border border-status-orange/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> Dock to Charge
                </button>
              </div>

              <button
                onClick={() => {
                  triggerEmergencyStop(selectedRobot.id);
                  sendRobotCommand(selectedRobot.id, 'EMERGENCY_STOP');
                }}
                className="px-4 py-2 rounded-lg bg-status-red/25 hover:bg-status-red/40 text-status-red border border-status-red/40 text-xs font-bold transition-all shadow-glow-red flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" /> Emergency Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ROBOT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-industrial-850 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-industrial-400 hover:text-white rounded-lg bg-industrial-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-status-cyan" /> Add Autonomous Robot
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-industrial-400 block mb-1">Robot Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. RBT-05"
                  value={newRobotData.id}
                  onChange={(e) => setNewRobotData({ ...newRobotData, id: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                />
              </div>
              <div>
                <label className="text-industrial-400 block mb-1">Robot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Robot 5"
                  value={newRobotData.name}
                  onChange={(e) => setNewRobotData({ ...newRobotData, name: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                />
              </div>
              <div>
                <label className="text-industrial-400 block mb-1">Initial Location</label>
                <select
                  value={newRobotData.location}
                  onChange={(e) => setNewRobotData({ ...newRobotData, location: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  <option value="HOME">HOME (Base Dock)</option>
                  <option value="CH01">CH01 (Charging Station)</option>
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-industrial-800 text-industrial-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newId = newRobotData.id || `RBT-0${robotList.length + 1}`;
                    sendRobotCommand(newId, 'STOP', {
                      id: newId,
                      name: newRobotData.name || `Robot ${newId}`,
                      currentLocation: newRobotData.location,
                      battery: 100,
                      status: 'Idle'
                    });
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-status-cyan text-black font-bold hover:bg-cyan-400 shadow-glow-cyan"
                >
                  Confirm & Provision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Robot;
