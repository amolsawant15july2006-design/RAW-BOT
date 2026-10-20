import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Shield, ArrowRight, LayoutDashboard, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicNavbar = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: 'Home', path: isAuthenticated ? '/home' : '/' },
    { name: 'About System', path: '/about' },
    { name: 'Contact / Operations', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-industrial-950/90 backdrop-blur-md border-b border-white/5 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-105">
            <Bot className="w-6 h-6 text-black font-extrabold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-base tracking-wider flex items-center gap-1.5">
              RAW BOT
              <span className="w-2 h-2 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
            </span>
            <span className="text-[9px] text-industrial-400 tracking-widest uppercase">
              Autonomous AMR Warehouse
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  isActive
                    ? 'text-status-cyan bg-status-cyan/10 border border-status-cyan/30 shadow-glow-cyan'
                    : 'text-industrial-300 hover:text-white hover:bg-industrial-800/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/home"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black text-xs font-bold shadow-glow-cyan transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Home Hub</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black text-xs font-bold shadow-glow-cyan transition-all"
            >
              <span>Operator Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
