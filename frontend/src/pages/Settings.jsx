import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Flame,
  Bell,
  HardDrive,
  Save,
  Check,
  RefreshCw,
  Cpu,
  Wifi,
  ShieldCheck
} from 'lucide-react';

const Settings = () => {
  const { firebaseConnected, backendConnected } = useRobot();
  const [activeSection, setActiveSection] = useState('general');
  const [savedMessage, setSavedMessage] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    warehouseName: 'RAW BOT Logistics Central',
    timezone: 'Asia/Kolkata (GMT+5:30)',
    language: 'English',
    autoLogout: 30
  });

  const [robotSettings, setRobotSettings] = useState({
    maxSpeed: 1.2,
    maxPayload: 2.5,
    navMode: 'AUTO_DYNAMIC',
    obstacleThreshold: 35,
    batteryThreshold: 25
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    browserAlerts: true,
    criticalSound: true,
    lowBatteryNotify: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const navItems = [
    { id: 'general', name: 'General Settings', icon: Sliders },
    { id: 'robot', name: 'Robot Configuration', icon: Cpu },
    { id: 'network', name: 'Network & Firebase', icon: Wifi },
    { id: 'notifications', name: 'Notification Settings', icon: Bell },
    { id: 'backup', name: 'Backup & Restore', icon: HardDrive }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            System Settings & Calibration
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            AMR kinematics, hardware communication thresholds, and database configuration
          </p>
        </div>

        {savedMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-green/20 border border-status-green/40 text-status-green text-xs font-mono font-bold animate-pulse">
            <Check className="w-4 h-4" /> Settings Saved Successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Menu (Image 2 #10 Left) */}
        <div className="lg:col-span-4 industrial-card p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
                    : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form Container (Image 2 #10 Right) */}
        <div className="lg:col-span-8 industrial-card p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-4 text-xs font-mono">
                <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2 font-sans">
                  General Facility Settings
                </h3>

                <div>
                  <label className="text-industrial-400 block mb-1">Warehouse Name</label>
                  <input
                    type="text"
                    value={generalSettings.warehouseName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, warehouseName: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  />
                </div>

                <div>
                  <label className="text-industrial-400 block mb-1">Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  >
                    <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                    <option value="UTC (GMT+0:00)">UTC (GMT+0:00)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  </select>
                </div>

                <div>
                  <label className="text-industrial-400 block mb-1">System Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  >
                    <option value="English">English</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>

                <div>
                  <label className="text-industrial-400 block mb-1">Auto Logout Inactivity (Minutes)</label>
                  <input
                    type="number"
                    value={generalSettings.autoLogout}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, autoLogout: Number(e.target.value) })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  />
                </div>
              </div>
            )}

            {/* 2. Robot Settings */}
            {activeSection === 'robot' && (
              <div className="space-y-4 text-xs font-mono">
                <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2 font-sans">
                  Robot Fleet & Kinematics Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-industrial-400 block mb-1">Max Speed (m/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={robotSettings.maxSpeed}
                      onChange={(e) => setRobotSettings({ ...robotSettings, maxSpeed: Number(e.target.value) })}
                      className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-industrial-400 block mb-1">Max Payload (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={robotSettings.maxPayload}
                      onChange={(e) => setRobotSettings({ ...robotSettings, maxPayload: Number(e.target.value) })}
                      className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-industrial-400 block mb-1">Obstacle Detection Threshold (cm)</label>
                    <input
                      type="number"
                      value={robotSettings.obstacleThreshold}
                      onChange={(e) => setRobotSettings({ ...robotSettings, obstacleThreshold: Number(e.target.value) })}
                      className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                    />
                  </div>

                  <div>
                    <label className="text-industrial-400 block mb-1">Low Battery Auto-Dock Threshold (%)</label>
                    <input
                      type="number"
                      value={robotSettings.batteryThreshold}
                      onChange={(e) => setRobotSettings({ ...robotSettings, batteryThreshold: Number(e.target.value) })}
                      className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Network & Firebase Status */}
            {activeSection === 'network' && (
              <div className="space-y-4 text-xs font-mono">
                <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2 font-sans">
                  Network & Cloud Realtime Architecture
                </h3>

                <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-industrial-300">Firebase Realtime Database:</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      firebaseConnected
                        ? 'bg-status-green/20 text-status-green border-status-green/40'
                        : 'bg-status-cyan/20 text-status-cyan border-status-cyan/40'
                    }`}>
                      {firebaseConnected ? 'CONNECTED (Cloud RTDB)' : 'ACTIVE (Local Realtime Simulator)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-industrial-300">Backend Express API (Port 5000):</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      backendConnected
                        ? 'bg-status-green/20 text-status-green border-status-green/40'
                        : 'bg-status-yellow/20 text-status-yellow border-status-yellow/40'
                    }`}>
                      {backendConnected ? 'ONLINE (HTTP 200)' : 'OFFLINE / FALLBACK'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-industrial-300">ESP32 Hardware Bridge Gateway:</span>
                    <span className="text-status-cyan font-bold">READY (WiFi / WebSocket / REST)</span>
                  </div>
                </div>

                <div>
                  <label className="text-industrial-400 block mb-1">Backend API Base URL</label>
                  <input
                    type="text"
                    readOnly
                    value="http://localhost:5000/api"
                    className="w-full bg-industrial-900/60 border border-white/5 rounded-lg p-2.5 text-industrial-400 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-industrial-500 mt-1">Configured via .env environment file</p>
                </div>
              </div>
            )}

            {/* 4. Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-4 text-xs font-mono">
                <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2 font-sans">
                  Industrial Alarm & Notification Parameters
                </h3>

                <div className="space-y-3">
                  {[
                    { key: 'emailAlerts', title: 'Email Dispatch for Critical Failures', desc: 'Notify warehouse administrator on emergency stop' },
                    { key: 'browserAlerts', title: 'Browser Push Notifications', desc: 'Display desktop banners for collision obstacles' },
                    { key: 'criticalSound', title: 'Audible Siren Audio Tone', desc: 'Play buzzer sound during emergency stop trigger' },
                    { key: 'lowBatteryNotify', title: 'Low Battery Auto-Notification', desc: 'Warn operator when any robot drops below 25%' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-industrial-900 border border-white/5">
                      <div>
                        <p className="text-white font-semibold">{item.title}</p>
                        <p className="text-industrial-400 text-[10px]">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key]}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                        className="w-4 h-4 accent-status-cyan cursor-pointer rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Backup & Restore */}
            {activeSection === 'backup' && (
              <div className="space-y-4 text-xs font-mono">
                <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2 font-sans">
                  Data Backup & Factory Calibration Reset
                </h3>

                <p className="text-industrial-400">
                  Export snapshot of warehouse layout, robot trajectories, and audit logs.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generalSettings, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `RAW_BOT_Config_Backup_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-industrial-800 hover:bg-industrial-700 text-white font-semibold border border-white/10"
                  >
                    Export System Configuration JSON
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
