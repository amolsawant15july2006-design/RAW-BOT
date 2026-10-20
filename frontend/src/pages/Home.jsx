import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import {
  Bot,
  Shield,
  Layers,
  Cpu,
  Radio,
  ArrowRight,
  Boxes,
  Zap,
  CheckCircle2,
  Activity,
  Compass,
  FileText
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(0,229,255,0.15),rgba(0,0,0,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-cyan/10 border border-status-cyan/30 text-status-cyan text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-status-cyan animate-pulse"></span>
              Autonomous Mecanum AMR Fleet Management v1.0
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Next-Gen Autonomous <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent">
                Robotic Warehouse System
              </span>
            </h1>

            <p className="text-sm sm:text-base text-industrial-300 font-normal leading-relaxed">
              RAW BOT connects multi-agent autonomous mobile robots (AMRs) with cloud-synchronized 
              telemetry, real-time 3D spatial mapping, RFID pallet checkpoints, and industrial safety interlocks.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black font-extrabold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all font-mono"
              >
                <span>Launch Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-industrial-800 hover:bg-industrial-750 text-white font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all font-mono"
              >
                <Cpu className="w-4 h-4 text-status-cyan" />
                <span>Hardware Architecture</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            <div className="industrial-card p-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-status-cyan font-mono">01</div>
              <div className="text-xs text-industrial-400 font-mono uppercase mt-1">Autonomous AGV Robot</div>
            </div>
            <div className="industrial-card p-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-status-green font-mono">05</div>
              <div className="text-xs text-industrial-400 font-mono uppercase mt-1">Pallets (A, B, C, D, Counter)</div>
            </div>
            <div className="industrial-card p-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-status-yellow font-mono">&le; 1.0 kg</div>
              <div className="text-xs text-industrial-400 font-mono uppercase mt-1">Load Cell Interlock Limit</div>
            </div>
            <div className="industrial-card p-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">ESP32</div>
              <div className="text-xs text-industrial-400 font-mono uppercase mt-1">Wi-Fi Telemetry Stream</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 User Roles Highlight */}
      <section className="py-16 bg-industrial-900/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Three-Tier Role-Based Security
            </h2>
            <p className="text-xs text-industrial-400 font-mono mt-2">
              Isolated capabilities prevent operational interference and protect physical safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin */}
            <div className="industrial-card p-6 border-2 border-status-cyan/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-status-cyan/20 border border-status-cyan/40 flex items-center justify-center text-status-cyan">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">1. Admin (System Boss)</h3>
                <p className="text-xs text-industrial-300 leading-relaxed">
                  Full system control with permission to manage robots, warehouse sections, user roles, 
                  audit logs, and database backup/restore operations.
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-industrial-400 pt-2 border-t border-white/5">
                  <li className="flex items-center gap-2 text-status-cyan">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Manage robot fleet & user credentials
                  </li>
                  <li className="flex items-center gap-2 text-status-cyan">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full audit logs with login/logout stamps
                  </li>
                  <li className="flex items-center gap-2 text-status-cyan">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hardware calibration & backup restore
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  to="/login"
                  className="w-full py-2 px-3 rounded-lg bg-status-cyan/15 hover:bg-status-cyan/25 text-status-cyan text-xs font-mono font-bold border border-status-cyan/30 flex items-center justify-center gap-1.5"
                >
                  <span>Login as Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Manager */}
            <div className="industrial-card p-6 border-2 border-status-yellow/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-status-yellow/20 border border-status-yellow/40 flex items-center justify-center text-status-yellow">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">2. Manager (Supervision)</h3>
                <p className="text-xs text-industrial-300 leading-relaxed">
                  Focused on operational throughput, fleet analytics, warehouse occupancy, 
                  daily/historical performance reports, and safety incident trends.
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-industrial-400 pt-2 border-t border-white/5">
                  <li className="flex items-center gap-2 text-status-yellow">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Daily & historical mission analytics
                  </li>
                  <li className="flex items-center gap-2 text-status-yellow">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Export reports to CSV & Print summaries
                  </li>
                  <li className="flex items-center gap-2 text-status-yellow">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Monitor warehouse pallets & fleet battery
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  to="/login"
                  className="w-full py-2 px-3 rounded-lg bg-status-yellow/15 hover:bg-status-yellow/25 text-status-yellow text-xs font-mono font-bold border border-status-yellow/30 flex items-center justify-center gap-1.5"
                >
                  <span>Login as Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Staff */}
            <div className="industrial-card p-6 border-2 border-status-green/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-status-green/20 border border-status-green/40 flex items-center justify-center text-status-green">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">3. Staff (Robot Operator)</h3>
                <p className="text-xs text-industrial-300 leading-relaxed">
                  Direct hands-on operator interface to schedule missions, select source and destination, 
                  dispatch AMR units, acknowledge alerts, and trigger emergency stops.
                </p>
                <ul className="space-y-1.5 text-xs font-mono text-industrial-400 pt-2 border-t border-white/5">
                  <li className="flex items-center gap-2 text-status-green">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dispatch autonomous transport missions
                  </li>
                  <li className="flex items-center gap-2 text-status-green">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 2D/3D live waypoint trajectory planner
                  </li>
                  <li className="flex items-center gap-2 text-status-green">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Start, Pause, Resume, and E-STOP
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  to="/login"
                  className="w-full py-2 px-3 rounded-lg bg-status-green/15 hover:bg-status-green/25 text-status-green text-xs font-mono font-bold border border-status-green/30 flex items-center justify-center gap-1.5"
                >
                  <span>Login as Staff</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-industrial-950 border-t border-white/5 font-mono text-xs text-industrial-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-status-cyan" />
            <span className="text-white font-bold">RAW BOT System</span>
            <span>• Computer Engineering Final Year Project</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/home" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/login" className="text-status-cyan hover:underline">Control Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
