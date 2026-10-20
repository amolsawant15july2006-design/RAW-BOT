import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Radio,
  Clock,
  ShieldAlert
} from 'lucide-react';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'OPERATIONS',
    priority: 'NORMAL',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', department: 'OPERATIONS', priority: 'NORMAL', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
        {/* Title */}
        <div className="border-b border-white/5 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-status-cyan/10 border border-status-cyan/30 text-status-cyan text-xs font-mono font-semibold">
            Support Desk & Mission Dispatch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Warehouse Operations & Engineering Contact
          </h1>
          <p className="text-sm sm:text-base text-industrial-300 max-w-3xl leading-relaxed">
            Need technical assistance with the autonomous robot fleet, ESP32 calibration, 
            RFID tag mappings, or emergency safety override procedures? Contact our engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="industrial-card p-6 space-y-6">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Radio className="w-4 h-4 text-status-cyan" />
                Dispatch & Control Centers
              </h2>

              <div className="space-y-4 text-xs font-mono">
                {/* Physical Location */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-industrial-900 border border-white/5">
                  <MapPin className="w-4 h-4 text-status-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Smart Warehouse Facility</span>
                    <span className="text-industrial-400">Section A–D Autonomous AMR Zone</span>
                    <span className="text-industrial-500 block text-[10px]">Mumbai, Maharashtra, India</span>
                  </div>
                </div>

                {/* Operations Email */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-industrial-900 border border-white/5">
                  <Mail className="w-4 h-4 text-status-green shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Support & Telemetry Gateway</span>
                    <span className="text-industrial-400">admin@rawbot.io</span>
                    <span className="text-industrial-500 block text-[10px]">Monitored 24/7 by AI Supervisor</span>
                  </div>
                </div>

                {/* Hotlines */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-industrial-900 border border-white/5">
                  <Phone className="w-4 h-4 text-status-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block">Emergency Fleet Hotline</span>
                    <span className="text-industrial-400">+91 (022) 555-RAW-BOT</span>
                    <span className="text-industrial-500 block text-[10px]">Immediate manual override & recovery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Notice Box */}
            <div className="p-4 rounded-xl bg-status-red/10 border border-status-red/30 space-y-2">
              <div className="flex items-center gap-2 text-status-red font-mono text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                Critical Physical Safety Warning
              </div>
              <p className="text-[11px] text-industrial-300 font-mono leading-relaxed">
                In the event of an unexpected hardware deviation or line loss during autonomous pallet pickup, 
                immediately activate the red physical E-STOP button mounted directly on the AMR chassis.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="industrial-card p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2 border-b border-white/5 pb-3">
                <Send className="w-4 h-4 text-status-cyan" />
                Send Inquiry to Robotics Engineering
              </h2>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-status-green/15 border border-status-green/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-status-green mx-auto" />
                  <h3 className="text-base font-bold text-white font-mono">Inquiry Dispatched Successfully!</h3>
                  <p className="text-xs text-industrial-300 font-mono">
                    Your message has been routed to the shift supervisor and engineering team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-industrial-400 block mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-industrial-400 block mb-1">Official Email</label>
                      <input
                        type="email"
                        required
                        placeholder="operator@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-industrial-400 block mb-1">Inquiry Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                      >
                        <option value="OPERATIONS">Fleet Operations & Dispatch</option>
                        <option value="HARDWARE">ESP32 & Sensor Hardware</option>
                        <option value="SAFETY">Safety Protocol & Interlocks</option>
                        <option value="SOFTWARE">Cloud API & Simulator</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-industrial-400 block mb-1">Urgency Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                      >
                        <option value="NORMAL">Normal — Routine Inquiry</option>
                        <option value="HIGH">High — Fleet Operational Blocker</option>
                        <option value="CRITICAL">Critical — Hardware Interlock Failure</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-industrial-400 block mb-1">Message / Operational Note</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Specify robot ID, warehouse section, error codes or calibration details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-glow-cyan flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Control Desk</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-industrial-950 border-t border-white/5 font-mono text-xs text-industrial-400 text-center">
        RAW BOT Autonomous AMR Warehouse Fleet v1.0.0
      </footer>
    </div>
  );
};

export default Contact;
