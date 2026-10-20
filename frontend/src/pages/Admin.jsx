import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useRobot } from '../context/RobotContext';
import {
  Shield,
  Users,
  UserPlus,
  Key,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Radio,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  X,
  History,
  UserCheck,
  LogOut,
  ArrowRightLeft,
  Power
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, auditLogs, switchRole, logout } = useAuth();
  const { robots, tasks, packages, alerts } = useRobot();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([
    {
      id: 'USR-001',
      name: 'Amol Sawant',
      email: 'admin@rawbot.io',
      role: 'ADMIN',
      title: 'System Administrator',
      status: 'Active',
      lastLogin: 'Today, 14:32:10'
    },
    {
      id: 'USR-002',
      name: 'Sarah Jenkins',
      email: 'manager@rawbot.io',
      role: 'MANAGER',
      title: 'Operations Manager',
      status: 'Active',
      lastLogin: 'Today, 11:15:22'
    },
    {
      id: 'USR-003',
      name: 'Vikram Patel',
      email: 'staff@rawbot.io',
      role: 'STAFF',
      title: 'Warehouse Staff / Operator',
      status: 'Active',
      lastLogin: 'Today, 09:40:05'
    }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'STAFF' });
  const [activeTab, setActiveTab] = useState('audit'); // Default to audit log per user request

  const toggleUserStatus = (id) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' } : u))
    );
  };

  const deleteUser = (id) => {
    if (confirm('Are you sure you want to remove this user from the system?')) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    let roleTitle = 'Warehouse Staff / Operator';
    if (newUserData.role === 'ADMIN') roleTitle = 'System Administrator';
    if (newUserData.role === 'MANAGER') roleTitle = 'Operations Manager';

    const newUser = {
      id: `USR-00${usersList.length + 1}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      title: roleTitle,
      status: 'Active',
      lastLogin: 'Never'
    };
    setUsersList([...usersList, newUser]);
    setShowAddUserModal(false);
    setNewUserData({ name: '', email: '', role: 'STAFF' });
  };

  const handleSwitchUser = (roleKey) => {
    switchRole(roleKey);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-status-cyan" />
            Admin Panel & System Authorization
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-status-cyan/20 text-status-cyan border border-status-cyan/40">
              Admin / Boss Privileges
            </span>
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            Audit trail of login/logout with timestamps, account switcher, user roles, and database inspection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black text-xs font-bold shadow-glow-cyan transition-all font-mono"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 font-mono text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'audit'
              ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
              : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Login / Logout Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('switch')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'switch'
              ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
              : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Switch User & Logout</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
              : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Role Management</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'database'
              ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
              : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Firebase Database</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'hardware'
              ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
              : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>ESP32 Gateway</span>
        </button>
      </div>

      {/* 1. LOGIN / LOGOUT AUDIT LOGS TAB (Explicit Requirement) */}
      {activeTab === 'audit' && (
        <div className="industrial-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <History className="w-4 h-4 text-status-cyan" />
                Authentication Audit Trail (Who Logged In / Logged Out)
              </h3>
              <p className="text-xs text-industrial-400 font-mono mt-0.5">
                Timestamped security entries for every login, role switch, and logout action
              </p>
            </div>
            <span className="text-xs font-mono text-status-green flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
              Audit Logging Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-industrial-900/80 text-[11px] text-industrial-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">User Account</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-industrial-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{log.id}</td>
                    <td className="py-3.5 px-4 text-industrial-200">
                      <span className="text-white font-semibold block">{log.name || log.user}</span>
                      <span className="text-[10px] text-industrial-400">{log.user}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.role === 'ADMIN'
                            ? 'bg-status-cyan/20 text-status-cyan border border-status-cyan/30'
                            : log.role === 'MANAGER'
                            ? 'bg-status-yellow/20 text-status-yellow border border-status-yellow/30'
                            : 'bg-status-green/20 text-status-green border border-status-green/30'
                        }`}
                      >
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action?.includes('LOGIN')
                            ? 'bg-status-green/15 text-status-green border border-status-green/30'
                            : 'bg-status-orange/15 text-status-orange border border-status-orange/30'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-bold">{log.timestamp}</td>
                    <td className="py-3.5 px-4 text-industrial-400">{log.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] text-status-green font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {log.result || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SWITCH USER & LOGOUT TAB (Explicit Requirement) */}
      {activeTab === 'switch' && (
        <div className="industrial-card p-6 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-status-cyan" />
              Switch to Different User Account
            </h3>
            <p className="text-xs text-industrial-400 font-mono mt-1">
              Currently logged in as: <strong className="text-status-cyan">{user?.name}</strong> ({user?.role} - {user?.email})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Switch to Admin */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${
              user?.role === 'ADMIN' ? 'border-status-cyan bg-industrial-800/80 shadow-glow-cyan' : 'border-white/5 bg-industrial-900'
            }`}>
              <div className="space-y-3 font-mono">
                <span className="text-[10px] text-status-cyan font-bold uppercase">Role: ADMIN</span>
                <h4 className="text-base font-bold text-white">{DEMO_USERS.ADMIN.name}</h4>
                <p className="text-xs text-industrial-400">{DEMO_USERS.ADMIN.email}</p>
                <div className="text-[11px] text-industrial-300">
                  Full control: settings, user roles, database backup/restore.
                </div>
              </div>
              <div className="pt-4">
                {user?.role === 'ADMIN' ? (
                  <span className="w-full py-2 rounded-xl bg-status-cyan/20 text-status-cyan text-xs font-bold font-mono flex items-center justify-center gap-1 border border-status-cyan/30">
                    <UserCheck className="w-4 h-4" /> Active User
                  </span>
                ) : (
                  <button
                    onClick={() => handleSwitchUser('ADMIN')}
                    className="w-full py-2 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black text-xs font-bold font-mono transition-all shadow-glow-cyan"
                  >
                    Switch to Admin
                  </button>
                )}
              </div>
            </div>

            {/* Switch to Manager */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${
              user?.role === 'MANAGER' ? 'border-status-yellow bg-industrial-800/80 shadow-glow-yellow' : 'border-white/5 bg-industrial-900'
            }`}>
              <div className="space-y-3 font-mono">
                <span className="text-[10px] text-status-yellow font-bold uppercase">Role: MANAGER</span>
                <h4 className="text-base font-bold text-white">{DEMO_USERS.MANAGER.name}</h4>
                <p className="text-xs text-industrial-400">{DEMO_USERS.MANAGER.email}</p>
                <div className="text-[11px] text-industrial-300">
                  Operational supervision: daily reports, warehouse occupancy, alerts.
                </div>
              </div>
              <div className="pt-4">
                {user?.role === 'MANAGER' ? (
                  <span className="w-full py-2 rounded-xl bg-status-yellow/20 text-status-yellow text-xs font-bold font-mono flex items-center justify-center gap-1 border border-status-yellow/30">
                    <UserCheck className="w-4 h-4" /> Active User
                  </span>
                ) : (
                  <button
                    onClick={() => handleSwitchUser('MANAGER')}
                    className="w-full py-2 rounded-xl bg-status-yellow hover:bg-amber-400 text-black text-xs font-bold font-mono transition-all shadow-glow-yellow"
                  >
                    Switch to Manager
                  </button>
                )}
              </div>
            </div>

            {/* Switch to Staff */}
            <div className={`p-5 rounded-2xl border-2 flex flex-col justify-between ${
              user?.role === 'STAFF' ? 'border-status-green bg-industrial-800/80 shadow-glow-green' : 'border-white/5 bg-industrial-900'
            }`}>
              <div className="space-y-3 font-mono">
                <span className="text-[10px] text-status-green font-bold uppercase">Role: STAFF</span>
                <h4 className="text-base font-bold text-white">{DEMO_USERS.STAFF.name}</h4>
                <p className="text-xs text-industrial-400">{DEMO_USERS.STAFF.email}</p>
                <div className="text-[11px] text-industrial-300">
                  AMR fleet operation: dispatch tasks, navigation, pause/resume, E-STOP.
                </div>
              </div>
              <div className="pt-4">
                {user?.role === 'STAFF' ? (
                  <span className="w-full py-2 rounded-xl bg-status-green/20 text-status-green text-xs font-bold font-mono flex items-center justify-center gap-1 border border-status-green/30">
                    <UserCheck className="w-4 h-4" /> Active User
                  </span>
                ) : (
                  <button
                    onClick={() => handleSwitchUser('STAFF')}
                    className="w-full py-2 rounded-xl bg-status-green hover:bg-emerald-400 text-black text-xs font-bold font-mono transition-all shadow-glow-green"
                  >
                    Switch to Staff
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Secure Logout Section */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <LogOut className="w-4 h-4 text-status-red" />
                Secure Terminal Logout
              </span>
              <p className="text-xs text-industrial-400 font-mono">
                Clears current user session token and records a timestamped logout audit log
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl bg-status-red/20 hover:bg-status-red/30 text-status-red text-xs font-bold font-mono border border-status-red/40 transition-all flex items-center gap-2 shadow-glow-red"
            >
              <Power className="w-4 h-4" />
              <span>Log Out of System</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="industrial-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-industrial-900/80 text-[11px] text-industrial-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-industrial-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-industrial-750 flex items-center justify-center text-[11px] font-bold text-status-cyan border border-white/5">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      {u.name}
                    </td>
                    <td className="py-4 px-4 text-industrial-300">{u.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.role === 'ADMIN'
                            ? 'bg-status-cyan/20 text-status-cyan border-status-cyan/40 shadow-glow-cyan'
                            : u.role === 'MANAGER'
                            ? 'bg-status-yellow/20 text-status-yellow border-status-yellow/40'
                            : 'bg-status-green/20 text-status-green border-status-green/40'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          u.status === 'Active' ? 'text-status-green' : 'text-industrial-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-status-green' : 'bg-industrial-600'}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-industrial-400">{u.lastLogin}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="p-1.5 rounded bg-industrial-750 hover:bg-industrial-700 text-industrial-300 hover:text-white transition-colors"
                          title={u.status === 'Active' ? 'Disable Account' : 'Activate Account'}
                        >
                          {u.status === 'Active' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="p-1.5 rounded bg-industrial-750 hover:bg-status-red/20 text-industrial-400 hover:text-status-red transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. FIREBASE REALTIME DB RAW INSPECTOR */}
      {activeTab === 'database' && (
        <div className="industrial-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-status-cyan" />
                Firebase Realtime Database Schema Explorer
              </h3>
              <p className="text-xs text-industrial-400 font-mono mt-0.5">
                Live JSON tree showing root nodes: /robot, /robots, /packages, /locations, /pallets, /alerts
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-industrial-950 border border-white/10 font-mono text-xs overflow-x-auto max-h-96">
            <pre className="text-status-cyan">
              {JSON.stringify(
                {
                  robot: {
                    command: 'START',
                    status: 'MOVING',
                    battery: robots['RBT-01']?.battery || 85,
                    weight: 0.72,
                    currentLocation: robots['RBT-01']?.currentLocation || 'Section A',
                    destination: robots['RBT-01']?.destination || 'Section B',
                    lift: robots['RBT-01']?.lift || 'UP'
                  },
                  robots,
                  packages,
                  pallets: {
                    A: { occupied: true, packageId: 'PKG_A001', rfidTagId: 'RF-A-984' },
                    B: { occupied: false, packageId: null, rfidTagId: 'RF-B-442' },
                    C: { occupied: true, packageId: 'PKG_C001', rfidTagId: 'RF-C-120' },
                    D: { occupied: false, packageId: null, rfidTagId: 'RF-D-773' }
                  },
                  tasks,
                  charging: {
                    dock: 'CHARGE_01',
                    status: 'ONLINE',
                    dockedRobot: 'RBT-02'
                  }
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* 5. ESP32 HARDWARE BRIDGE GATEWAY */}
      {activeTab === 'hardware' && (
        <div className="industrial-card p-5 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
            <Cpu className="w-4 h-4 text-status-cyan" />
            ESP32 Autonomous Hardware Bridge Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-industrial-400 uppercase text-[10px]">Controller IP</span>
              <p className="text-base font-bold text-white">192.168.1.150:80</p>
              <span className="text-[10px] text-status-green flex items-center gap-1">
                ● WiFi RSSI: -48 dBm
              </span>
            </div>

            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-industrial-400 uppercase text-[10px]">Command Polling</span>
              <p className="text-base font-bold text-status-cyan">HTTP GET /api/robots/RBT-01</p>
              <span className="text-[10px] text-industrial-400">1000ms loop frequency</span>
            </div>

            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-industrial-400 uppercase text-[10px]">Telemetry Stream</span>
              <p className="text-base font-bold text-status-green">PUT /api/robots/RBT-01</p>
              <span className="text-[10px] text-industrial-400">Ultrasonic + IR + Battery</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
            <span className="text-white font-bold block font-sans">ESP32 Sample Arduino Firmware</span>
            <p className="text-industrial-400 leading-relaxed">
              The complete Arduino C++ firmware sketch is located at <code className="text-status-cyan">backend/esp32/esp32_firmware_sample.ino</code>.
              Flash it directly using Arduino IDE or PlatformIO to establish communication with this dashboard.
            </p>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-industrial-850 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute top-4 right-4 p-1.5 text-industrial-400 hover:text-white rounded-lg bg-industrial-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-status-cyan" /> Provision System User
            </h3>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-industrial-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  required
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="staff2@rawbot.io"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  required
                />
              </div>

              <div>
                <label className="text-industrial-400 block mb-1">Access Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  <option value="STAFF">STAFF (Robot Operator & Tasks)</option>
                  <option value="MANAGER">MANAGER (Reports & Operational Monitoring)</option>
                  <option value="ADMIN">ADMIN / BOSS (Full System Privileges)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-lg bg-industrial-800 text-industrial-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-status-cyan text-black font-bold hover:bg-cyan-400 shadow-glow-cyan"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
