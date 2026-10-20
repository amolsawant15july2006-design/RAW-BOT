import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRobot } from '../context/RobotContext';
import NotificationDropdown from './NotificationDropdown';
import { 
  Cpu, 
  User, 
  AlertOctagon,
  LogOut
} from 'lucide-react';

const routeTitles = {
  '/home': 'Home',
  '/dashboard': 'Home',
  '/robots': 'Robot',
  '/tasks': 'Tasks',
  '/pallets': 'Pallets',
  '/warehouse': 'Warehouse 3D',
  '/map': 'Warehouse Map',
  '/navigation': 'Navigation',
  '/reports': 'Reports',
  '/alerts': 'Alerts',
  '/settings': 'Settings',
  '/admin': 'Admin Panel',
  '/about': 'About',
  '/contact': 'Contact'
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    simulationMode, 
    setSimulationMode, 
    triggerEmergencyStop 
  } = useRobot();

  const pageTitle = routeTitles[location.pathname] || 'Home';

  return (
    <header className="h-16 px-6 sm:px-8 lg:px-10 bg-industrial-900/80 border-b border-white/[0.08] backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-lg">
      {/* Left: Clean Page Title Only ("Home") */}
      <div className="flex items-center gap-3 shrink-0">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5 font-mono">
          {pageTitle}
          <span className="w-2 h-2 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
        </h1>
      </div>

      {/* Right: Actions, Simulation Toggle, Notifications, User Profile & Log Out */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Simulation Mode Toggle Button */}
        <button
          onClick={() => setSimulationMode(!simulationMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
            simulationMode
              ? 'bg-status-cyan/15 text-status-cyan border-status-cyan/40 shadow-glow-cyan'
              : 'bg-industrial-800 text-industrial-400 border-white/10 hover:text-white'
          }`}
          title="Toggle between autonomous Simulation Mode and Live Hardware Mode"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{simulationMode ? 'SIMULATION ON' : 'LIVE HW'}</span>
        </button>

        {/* Emergency Stop Button */}
        <button
          onClick={() => triggerEmergencyStop('RBT-01')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-red/15 hover:bg-status-red/30 text-status-red border border-status-red/35 text-xs font-bold font-mono transition-all shadow-glow-red"
          title="Emergency Stop All Motors"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">E-STOP</span>
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Role Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white leading-tight">{user?.name || 'Amol Sawant'}</span>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold tracking-wider ${
                  user?.role === 'ADMIN'
                    ? 'bg-status-cyan/20 text-status-cyan border border-status-cyan/30'
                    : user?.role === 'MANAGER'
                    ? 'bg-status-yellow/20 text-status-yellow border border-status-yellow/30'
                    : 'bg-status-green/20 text-status-green border border-status-green/30'
                }`}
              >
                {user?.role || 'STAFF'}
              </span>
            </div>
          </div>

          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
              user?.role === 'ADMIN'
                ? 'bg-status-cyan/10 border-status-cyan/40 text-status-cyan'
                : user?.role === 'MANAGER'
                ? 'bg-status-yellow/10 border-status-yellow/40 text-status-yellow'
                : 'bg-status-green/10 border-status-green/40 text-status-green'
            }`}
          >
            <User className="w-4 h-4" />
          </div>

          {/* Prominent Log Out Button */}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-red/15 hover:bg-status-red/25 text-status-red border border-status-red/35 hover:border-status-red/60 text-xs font-mono font-bold transition-all shadow-glow-red cursor-pointer"
            title="Log Out of System"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
