import React, { useState, useRef, useEffect } from 'react';
import { useRobot } from '../context/RobotContext';
import { Bell, Check, Trash2, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, unreadAlertsCount, markAlertRead, clearAlerts } = useRobot();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-industrial-300 hover:text-white border border-white/5 transition-colors"
        title="Industrial Incident Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadAlertsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-red text-[10px] font-bold text-white shadow-glow-red animate-pulse">
            {unreadAlertsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-industrial-850 border border-white/10 shadow-2xl shadow-black/80 z-50 overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-industrial-900/60">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">System Notifications</span>
              {unreadAlertsCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-status-red/20 text-status-red font-medium border border-status-red/30">
                  {unreadAlertsCount} new
                </span>
              )}
            </div>
            {alerts.length > 0 && (
              <button
                onClick={clearAlerts}
                className="text-xs text-industrial-400 hover:text-status-red flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-industrial-400">
                No active notifications or alerts.
              </div>
            ) : (
              alerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => markAlertRead(alert.id)}
                  className={`p-3 text-xs cursor-pointer transition-colors flex items-start gap-3 hover:bg-industrial-800/60 ${
                    alert.status === 'Unread' ? 'bg-industrial-800/30' : 'opacity-70'
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-white truncate">{alert.robotId || 'System'}</span>
                      <span className="text-[10px] text-industrial-400">{alert.time}</span>
                    </div>
                    <p className="text-industrial-300 text-[11px] leading-relaxed break-words">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-white/5 bg-industrial-900/40 text-center">
            <Link
              to="/alerts"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1 w-full py-1.5 text-xs text-status-cyan hover:underline font-medium"
            >
              View Full Alert Log <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
