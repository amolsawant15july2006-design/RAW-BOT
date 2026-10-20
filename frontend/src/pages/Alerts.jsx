import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import {
  BellRing,
  AlertCircle,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  Filter,
  Search,
  Radio,
  Plus
} from 'lucide-react';

const Alerts = () => {
  const { alerts, markAlertRead, clearAlerts, triggerSimulatedObstacle, addAlert } = useRobot();
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInjectors, setShowInjectors] = useState(false);

  const simulateAlert = (type, message) => {
    addAlert(type, message, 'RBT-01');
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesFilter = filterType === 'All' || a.type?.toLowerCase() === filterType.toLowerCase();
    const matchesSearch =
      a.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.robotId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'critical':
        return 'bg-status-red/15 text-status-red border-status-red/40 shadow-glow-red font-bold';
      case 'warning':
        return 'bg-status-yellow/15 text-status-yellow border-status-yellow/40 font-bold';
      default:
        return 'bg-status-cyan/15 text-status-cyan border-status-cyan/40 font-bold';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-status-red" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-status-yellow" />;
      default:
        return <Info className="w-4 h-4 text-status-cyan" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Real-Time Incident Alerts & Safety Log
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-red border border-status-red/30">
              {alerts.filter((a) => a.status === 'Unread').length} Unacknowledged
            </span>
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            AMR collision avoidance, low battery triggers, RFID checkpoints, and safety interlocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Fault Simulator Strip */}
          <button
            onClick={() => setShowInjectors(!showInjectors)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-status-cyan/15 hover:bg-status-cyan/25 text-status-cyan text-xs font-semibold border border-status-cyan/30 transition-colors"
          >
            <Radio className="w-4 h-4" />
            <span>{showInjectors ? 'Hide Fault Triggers' : 'Simulate Sensor Fault'}</span>
          </button>

          {/* Clear All */}
          <button
            onClick={clearAlerts}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-industrial-800 hover:bg-industrial-700 text-industrial-300 hover:text-white text-xs font-semibold border border-white/5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* 7 Sensor Alert Injector Strip */}
      {showInjectors && (
        <div className="industrial-card p-4 space-y-2 border border-status-cyan/30 bg-industrial-900/90 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between text-industrial-400 text-[11px] pb-1 border-b border-white/5">
            <span className="font-bold text-white uppercase">Simulate Real Sensor Triggers (Requirements Spec):</span>
            <span>7 Automated Alert Presets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
            <button
              onClick={() => simulateAlert('Critical', 'Obstacle Detected — HC-SR04 front range 18cm (Motor Cutoff)')}
              className="p-2 rounded-lg bg-status-red/15 hover:bg-status-red/25 text-status-red border border-status-red/30 text-[10px] font-bold text-center"
            >
              1. Obstacle Detected
            </button>
            <button
              onClick={() => simulateAlert('Warning', 'Out of Line / Off Route — TCRT5000 line track lost at Path Section A → Section B')}
              className="p-2 rounded-lg bg-status-yellow/15 hover:bg-status-yellow/25 text-status-yellow border border-status-yellow/30 text-[10px] font-bold text-center"
            >
              2. Out of Line
            </button>
            <button
              onClick={() => simulateAlert('Critical', 'Weight Warning: Package weight is more than 1 kg (Limit: 1.0 kg) — Lift aborted')}
              className="p-2 rounded-lg bg-status-red/15 hover:bg-status-red/25 text-status-red border border-status-red/30 text-[10px] font-bold text-center"
            >
              3. Weight Alert (&gt;1kg)
            </button>
            <button
              onClick={() => simulateAlert('Warning', 'Low Battery Warning — INA219 measured 18% (Returning to CH01)')}
              className="p-2 rounded-lg bg-status-yellow/15 hover:bg-status-yellow/25 text-status-yellow border border-status-yellow/30 text-[10px] font-bold text-center"
            >
              4. Low Battery
            </button>
            <button
              onClick={() => simulateAlert('Info', 'Task Completed — Verified delivery of PKG_A001 at Section C')}
              className="p-2 rounded-lg bg-status-green/15 hover:bg-status-green/25 text-status-green border border-status-green/30 text-[10px] font-bold text-center"
            >
              5. Task Completed
            </button>
            <button
              onClick={() => simulateAlert('Warning', 'RFID Not Detected — RC522 reader timeout at Section C checkpoint')}
              className="p-2 rounded-lg bg-status-yellow/15 hover:bg-status-yellow/25 text-status-yellow border border-status-yellow/30 text-[10px] font-bold text-center"
            >
              6. RFID Not Detected
            </button>
            <button
              onClick={() => simulateAlert('Critical', 'QR Code Not Identified — ESP32-CAM frame mismatch at pickup stand')}
              className="p-2 rounded-lg bg-status-red/15 hover:bg-status-red/25 text-status-red border border-status-red/30 text-[10px] font-bold text-center"
            >
              7. QR Not Identified
            </button>
          </div>
        </div>
      )}

      {/* Filter Pills matching Image 2 #9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['All', 'Critical', 'Warning', 'Info'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterType === f
                  ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
                  : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by robot, text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-industrial-850 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-industrial-500 focus:outline-none focus:border-status-cyan font-mono w-56 sm:w-64"
          />
        </div>
      </div>

      {/* Alert Table matching Image 2 #9 */}
      <div className="industrial-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-industrial-900/80 text-[11px] text-industrial-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Robot ID</th>
                <th className="py-3.5 px-4">Message</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-industrial-400">
                    No incident alerts matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((a) => (
                  <tr
                    key={a.id}
                    className={`transition-colors hover:bg-industrial-800/40 ${
                      a.status === 'Unread' ? 'bg-industrial-800/20' : 'opacity-70'
                    }`}
                  >
                    <td className="py-4 px-4 text-industrial-300 font-semibold">{a.time}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1.5 border ${getSeverityBadge(a.type)}`}>
                        {getSeverityIcon(a.type)}
                        {a.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">{a.robotId || 'SYSTEM'}</td>
                    <td className="py-4 px-4 text-industrial-200 max-w-md">{a.message}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold ${
                          a.status === 'Unread' ? 'text-status-red' : 'text-industrial-400'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {a.status === 'Unread' ? (
                        <button
                          onClick={() => markAlertRead(a.id)}
                          className="px-2.5 py-1 rounded bg-industrial-750 hover:bg-industrial-700 text-status-cyan text-[11px] font-semibold border border-white/5 transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Acknowledge
                        </button>
                      ) : (
                        <span className="text-industrial-500 text-[11px]">Read</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
