import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import {
  Bot,
  Cpu,
  Layers,
  Radio,
  Shield,
  Zap,
  Boxes,
  Activity,
  CheckCircle2,
  Server,
  Cloud,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const hardwareSpecs = [
    {
      category: 'Locomotion & Mobility',
      items: [
        '4-Wheel Mecanum Omnidirectional Drive System',
        'Dual L298N / TB6612FNG High-Current Motor Drivers',
        'Independent PWM velocity & holonomic directional control',
        'MPU6050 6-Axis Gyroscope & Accelerometer for heading stabilization'
      ]
    },
    {
      category: 'Perception & Verification',
      items: [
        'HC-SR04 Ultrasonic Array (30cm local collision-avoidance cutoff)',
        '3-Channel TCRT5000 IR Line-Following Optical Grid',
        'RC522 13.56MHz RFID Reader for Pallet Checkpoint Localization',
        'ESP32-CAM Video Camera for Real-Time QR & Barcode Payload Verification'
      ]
    },
    {
      category: 'Payload & Actuation',
      items: [
        'Motorized Scissor Lift Platform (UP / DOWN limit-switch safety)',
        'HX711 24-Bit ADC + Strain-Gauge Load Cell for accurate weight weighing',
        'INA219 I2C Voltage & Current Sensor for battery health telemetry',
        'Automatic Charging Dock Contacts (CH01 Docking station)'
      ]
    },
    {
      category: 'Distributed Processing',
      items: [
        'ESP32 Master: Real-time navigation, line following, RFID & Wi-Fi bridge',
        'ESP32 Slave: Scissor lift servoing, load cell, and QR camera streaming',
        'Inter-ESP32 I2C / Serial Hardware Handshake protocol',
        'Hardware Watchdog & Fail-Safe Auto-Stop on Wi-Fi connection loss'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
        {/* Title & Introduction */}
        <div className="border-b border-white/5 pb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-status-cyan/10 border border-status-cyan/30 text-status-cyan text-xs font-mono font-semibold">
            System Specifications & Whitepaper
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            RAW BOT Architectural Design & Specifications
          </h1>
          <p className="text-sm sm:text-base text-industrial-300 max-w-3xl leading-relaxed">
            Robotic Autonomous Warehouse Bot (RAW BOT) is an end-to-end cyber-physical system designed 
            to solve intralogistics bottlenecks in smart warehouses. It integrates real-time web telemetry, 
            cloud databases, and embedded dual-core ESP32 microcontrollers.
          </p>
        </div>

        {/* System Communication Pipeline Flow */}
        <section className="industrial-card p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-status-cyan" />
            Complete Communication Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-status-cyan font-bold block text-sm">1. Web Frontend</span>
              <p className="text-industrial-300">
                React.js + Tailwind CSS with 10 operational pages, 3D Three.js digital twin, and role-based permissions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-status-green font-bold block text-sm">2. Node.js Gateway</span>
              <p className="text-industrial-300">
                Express.js REST APIs, command validation, role middleware, rate limiting, and audit logging.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-status-yellow font-bold block text-sm">3. Firebase Cloud</span>
              <p className="text-industrial-300">
                Cloud Firestore & Realtime Database for live telemetry streaming, command queues, and task states.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-purple-400 font-bold block text-sm">4. ESP32 AMR Bot</span>
              <p className="text-industrial-300">
                Mecanum chassis with local obstacle cutoff, IR line tracking, RFID checkpoints, and motorized lift.
              </p>
            </div>
          </div>
        </section>

        {/* Hardware Modules Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-status-cyan" />
              Robotic Hardware & Sensor Architecture
            </h2>
            <p className="text-xs text-industrial-400 font-mono mt-1">
              Industrial grade sensors and embedded components mounted on the physical chassis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hardwareSpecs.map((spec) => (
              <div key={spec.category} className="industrial-card p-6 space-y-4">
                <h3 className="text-base font-bold text-white font-mono text-status-cyan border-b border-white/5 pb-2">
                  {spec.category}
                </h3>
                <ul className="space-y-2.5 text-xs text-industrial-300">
                  {spec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-status-green shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Deployment Stack */}
        <section className="industrial-card p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-status-cyan" />
            Google Cloud & Firebase Production Hosting
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-status-cyan font-bold block">Frontend Deployment</span>
              <p className="text-industrial-300">
                Hosted globally via Firebase Hosting CDN with zero-latency edge caching and automatic SSL certificates.
              </p>
              <div className="text-[11px] text-industrial-400">Command: <code className="text-white">firebase deploy --only hosting</code></div>
            </div>
            <div className="p-4 rounded-xl bg-industrial-900 border border-white/5 space-y-2">
              <span className="text-status-green font-bold block">Backend Deployment</span>
              <p className="text-industrial-300">
                Containerized Node.js Express server running on Google Cloud Run with automatic auto-scaling.
              </p>
              <div className="text-[11px] text-industrial-400">Service: <code className="text-white">gcloud run deploy raw-bot-api</code></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black font-extrabold text-sm shadow-glow-cyan transition-all font-mono"
          >
            <span>Access Control Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-industrial-950 border-t border-white/5 font-mono text-xs text-industrial-400 text-center">
        RAW BOT Autonomous AMR Warehouse Fleet v1.0.0
      </footer>
    </div>
  );
};

export default About;
