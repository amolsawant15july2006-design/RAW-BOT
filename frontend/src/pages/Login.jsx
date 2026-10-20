import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, SYSTEM_USERS } from '../context/AuthContext';
import {
  Bot,
  Shield,
  User,
  Key,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Home,
  Info,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ArrowRight
} from 'lucide-react';

const Login = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // If already authenticated, redirect to /home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res?.success) {
      navigate('/home');
    } else {
      setError(res?.message || 'Invalid email or password. Please verify credentials.');
    }
  };

  // Helper to quickly fill credentials for testing
  const handleQuickFill = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-industrial-950 flex flex-col justify-between items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.12),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Bar with Public Links */}
      <div className="w-full max-w-5xl flex items-center justify-between py-4 relative z-20 font-mono text-xs">
        <Link to="/home" className="flex items-center gap-2 text-white font-bold hover:text-status-cyan transition-colors">
          <Bot className="w-5 h-5 text-status-cyan" />
          <span>RAW BOT SYSTEM</span>
        </Link>

        <div className="flex items-center gap-4 text-industrial-400">
          <Link to="/home" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link to="/about" className="flex items-center gap-1 hover:text-white transition-colors">
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </Link>
          <Link to="/contact" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span>Contact</span>
          </Link>
        </div>
      </div>

      {/* Center Unified Single Login Box */}
      <div className="w-full max-w-md relative z-10 my-auto py-6">
        <div className="industrial-card p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10 backdrop-blur-xl bg-industrial-900/90">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan mb-1">
              <Bot className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide font-mono">
              RAW BOT CONTROL CENTER
            </h1>
            <p className="text-xs text-status-cyan font-mono tracking-wider">
              Autonomous AMR Warehouse System • Sign In
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-status-red/15 border border-status-red/40 text-status-red text-xs font-mono flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Single Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Email Field */}
            <div>
              <label className="text-industrial-300 block mb-1.5 font-semibold">
                User Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rawbot.io, manager@rawbot.io, or staff@rawbot.io"
                  className="w-full bg-industrial-950/80 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-industrial-500 focus:outline-none focus:border-status-cyan focus:ring-1 focus:ring-status-cyan transition-all text-xs"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-industrial-300 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-status-cyan hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-industrial-950/80 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-industrial-500 focus:outline-none focus:border-status-cyan focus:ring-1 focus:ring-status-cyan transition-all text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-industrial-400 hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-glow-cyan flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Credentials Reference Card for All 3 Separate Users */}
          <div className="pt-3 border-t border-white/5 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-industrial-400 text-[10px] uppercase font-bold tracking-wider">
              <span>Authorized System Accounts:</span>
              <span className="text-status-cyan">Click to Autofill</span>
            </div>

            <div className="space-y-1.5">
              {/* 1. Admin */}
              <div
                onClick={() => handleQuickFill('admin@rawbot.io', 'admin123')}
                className="p-2.5 rounded-lg bg-industrial-950/70 border border-status-cyan/20 hover:border-status-cyan/50 hover:bg-industrial-800/60 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-status-cyan" />
                  <div>
                    <span className="font-bold text-white text-[11px] block">1. Admin (Boss)</span>
                    <span className="text-[10px] text-industrial-400">admin@rawbot.io</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-status-cyan bg-status-cyan/10 px-2 py-0.5 rounded border border-status-cyan/30">
                    admin123
                  </span>
                </div>
              </div>

              {/* 2. Manager */}
              <div
                onClick={() => handleQuickFill('manager@rawbot.io', 'manager123')}
                className="p-2.5 rounded-lg bg-industrial-950/70 border border-status-yellow/20 hover:border-status-yellow/50 hover:bg-industrial-800/60 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-status-yellow" />
                  <div>
                    <span className="font-bold text-white text-[11px] block">2. Manager</span>
                    <span className="text-[10px] text-industrial-400">manager@rawbot.io</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-status-yellow bg-status-yellow/10 px-2 py-0.5 rounded border border-status-yellow/30">
                    manager123
                  </span>
                </div>
              </div>

              {/* 3. Staff */}
              <div
                onClick={() => handleQuickFill('staff@rawbot.io', 'staff123')}
                className="p-2.5 rounded-lg bg-industrial-950/70 border border-status-green/20 hover:border-status-green/50 hover:bg-industrial-800/60 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-status-green" />
                  <div>
                    <span className="font-bold text-white text-[11px] block">3. Staff (Operator)</span>
                    <span className="text-[10px] text-industrial-400">staff@rawbot.io</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-status-green bg-status-green/10 px-2 py-0.5 rounded border border-status-green/30">
                    staff123
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-industrial-850 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative font-mono text-xs">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 text-industrial-400 hover:text-white rounded-lg bg-industrial-800"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-status-cyan" />
              Credentials Guide
            </h3>
            <p className="text-industrial-400 mb-4 leading-relaxed text-[11px]">
              Use the authorized user credentials for each warehouse role:
            </p>
            <div className="space-y-2 p-3 rounded-xl bg-industrial-900 border border-white/5 text-[11px]">
              <div><strong className="text-status-cyan">Admin (Boss):</strong> admin@rawbot.io / admin123</div>
              <div><strong className="text-status-yellow">Manager:</strong> manager@rawbot.io / manager123</div>
              <div><strong className="text-status-green">Staff:</strong> staff@rawbot.io / staff123</div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="mt-4 w-full py-2 rounded-lg bg-industrial-700 hover:bg-industrial-600 text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer System Status Tag */}
      <div className="w-full max-w-5xl py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-industrial-500 relative z-10 gap-2">
        <span>RAW BOT Autonomous AMR Warehouse Fleet v1.0.0</span>
        <div className="flex items-center gap-4">
          <Link to="/home" className="hover:text-white transition-colors">Home</Link>
          <Link to="/about" className="hover:text-white transition-colors">About System</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Dispatch Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
