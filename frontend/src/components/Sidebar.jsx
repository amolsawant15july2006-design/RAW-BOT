import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRobot } from '../context/RobotContext';
import {
  Home as HomeIcon,
  Bot,
  ListTodo,
  Boxes,
  Building2,
  Compass,
  Navigation as NavIcon,
  BarChart3,
  BellRing,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  BatteryCharging,
  Power,
  Info,
  Phone
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { primaryRobot } = useRobot();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Robots', path: '/robots', icon: Bot },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
    { name: 'Pallets', path: '/pallets', icon: Boxes },
    { name: 'Warehouse', path: '/warehouse', icon: Building2 },
    { name: 'Map', path: '/map', icon: Compass },
    { name: 'Navigation', path: '/navigation', icon: NavIcon },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Alerts', path: '/alerts', icon: BellRing },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Admin Panel', path: '/admin', icon: Shield, adminOnly: true }
  ];

  const secondaryLinks = [
    { name: 'About System', path: '/about', icon: Info },
    { name: 'Contact Operations', path: '/contact', icon: Phone }
  ];

  return (
    <aside
      className={`h-screen bg-industrial-900 border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Logo */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
                <Bot className="w-5 h-5 text-black font-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-wider flex items-center gap-1.5">
                  RAW BOT
                  <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
                </span>
                <span className="text-[9px] font-mono text-industrial-400 tracking-widest uppercase">
                  Autonomous Fleet
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
              <Bot className="w-5 h-5 text-black font-bold" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-industrial-400 hover:text-white hover:bg-industrial-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if restricted
            const isRestricted = item.adminOnly && !isAdmin;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan font-semibold'
                      : isRestricted
                      ? 'text-industrial-500 opacity-60 hover:bg-industrial-800/40'
                      : 'text-industrial-300 hover:text-white hover:bg-industrial-800/60'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 shrink-0`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    {item.name}
                    {item.adminOnly && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-industrial-700 text-status-cyan border border-status-cyan/20">
                        ADMIN
                      </span>
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-2 pb-1 border-t border-white/5 my-1">
            {!collapsed && (
              <span className="text-[10px] font-mono uppercase text-industrial-500 px-3 tracking-wider">
                Information
              </span>
            )}
          </div>
          {secondaryLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 font-semibold'
                      : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Robot Status Card & User Profile */}
      <div className="p-3 border-t border-white/5 space-y-3">
        {/* Robot R01 Widget (matching Image 1) */}
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-industrial-850 border border-white/5 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-status-cyan" />
                Robot {primaryRobot.id || 'RBT-01'}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-status-green">
                <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse"></span>
                <span>ONLINE</span>
              </div>
            </div>

            {/* Battery bar */}
            <div>
              <div className="flex justify-between text-[11px] text-industrial-300 font-mono mb-1">
                <span>Battery</span>
                <span className="text-status-green font-bold">{primaryRobot.battery || 78}%</span>
              </div>
              <div className="w-full h-1.5 bg-industrial-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${primaryRobot.battery || 78}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-white/5 text-industrial-400">
              <div>
                <span>Load: </span>
                <span className="text-white font-semibold">{primaryRobot.weight || 1.0} kg</span>
              </div>
              <div className="text-right">
                <span>Mode: </span>
                <span className="text-status-cyan font-semibold">{primaryRobot.mode || 'AUTO'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-2 rounded-xl bg-industrial-850 border border-white/5 text-center">
            <Bot className="w-4 h-4 text-status-cyan mb-1" />
            <span className="text-[10px] font-mono text-status-green font-bold">{primaryRobot.battery || 78}%</span>
          </div>
        )}

        {/* User Card & Logout */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          {!collapsed ? (
            <div className="flex items-center gap-2 min-w-0 px-1">
              <div className="w-8 h-8 rounded-lg bg-industrial-750 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{user?.name || 'Amol Sawant'}</span>
                <span className="text-[10px] text-status-cyan font-mono truncate font-semibold">{user?.role || 'STAFF'}</span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-lg bg-industrial-750 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
          )}

          {/* Prominent Log Out Button */}
          <button
            onClick={handleLogout}
            className={`w-full py-2 px-3 rounded-xl bg-status-red/10 hover:bg-status-red/25 text-status-red border border-status-red/30 hover:border-status-red/50 transition-all font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-glow-red ${
              collapsed ? 'px-1' : ''
            }`}
            title="Log Out of System"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
