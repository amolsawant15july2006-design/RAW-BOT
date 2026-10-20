import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import { 
  Boxes, 
  QrCode, 
  Radio, 
  MapPin, 
  Weight, 
  Bot, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Layers,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const Pallets = () => {
  const { packages, robots } = useRobot();

  // Initial Section State matching explicit project specification:
  // Section A: Occupied (Package PKG_A001)
  // Section B: Empty
  // Section C: Occupied (Package PKG_C001)
  // Section D: Empty
  // Exactly 1 package slot per section with unique RFID reader & tag
  const [palletSections, setPalletSections] = useState([
    {
      code: 'A',
      name: 'Section A',
      occupied: true,
      package: {
        id: 'PKG_A001',
        qr: 'PKG_A001',
        rfid: 'RF-A-984',
        type: 'Empty Box',
        status: 'STORED',
        assignedRobot: 'RBT-01'
      },
      rfidTagId: 'RF-A-984',
      scannerId: 'RC522-SEC-A',
      lastScanTime: '14:30:15',
      color: 'border-status-cyan/40 bg-status-cyan/5 text-status-cyan',
      headerBg: 'bg-cyan-500/20 text-status-cyan',
      badge: 'border-status-cyan/30 text-status-cyan'
    },
    {
      code: 'B',
      name: 'Section B',
      occupied: false,
      package: null,
      rfidTagId: 'RF-B-442',
      scannerId: 'RC522-SEC-B',
      lastScanTime: '14:15:02',
      color: 'border-status-yellow/40 bg-status-yellow/5 text-status-yellow',
      headerBg: 'bg-amber-500/20 text-status-yellow',
      badge: 'border-status-yellow/30 text-status-yellow'
    },
    {
      code: 'C',
      name: 'Section C',
      occupied: true,
      package: {
        id: 'PKG_C001',
        qr: 'PKG_C001',
        rfid: 'RF-C-120',
        type: 'Empty Box',
        status: 'STORED',
        assignedRobot: null
      },
      rfidTagId: 'RF-C-120',
      scannerId: 'RC522-SEC-C',
      lastScanTime: '14:28:40',
      color: 'border-status-green/40 bg-status-green/5 text-status-green',
      headerBg: 'bg-emerald-500/20 text-status-green',
      badge: 'border-status-green/30 text-status-green'
    },
    {
      code: 'D',
      name: 'Section D',
      occupied: false,
      package: null,
      rfidTagId: 'RF-D-773',
      scannerId: 'RC522-SEC-D',
      lastScanTime: '13:50:11',
      color: 'border-purple-500/40 bg-purple-500/5 text-purple-400',
      headerBg: 'bg-purple-500/20 text-purple-400',
      badge: 'border-purple-500/30 text-purple-400'
    },
    {
      code: 'CTR',
      name: 'Counter Pallet',
      occupied: false,
      package: null,
      rfidTagId: 'RF-CTR-501',
      scannerId: 'RC522-COUNTER',
      lastScanTime: '14:10:00',
      color: 'border-amber-500/40 bg-amber-500/5 text-amber-400',
      headerBg: 'bg-amber-500/20 text-amber-400',
      badge: 'border-amber-500/30 text-amber-400'
    }
  ]);

  const [scanHistory, setScanHistory] = useState([
    {
      id: 'EVT-101',
      section: 'Section A',
      rfid: 'RF-A-984',
      reader: 'RC522-SEC-A',
      packageId: 'PKG_A001',
      time: '14:30:15',
      result: 'VERIFIED OCCUPIED'
    },
    {
      id: 'EVT-102',
      section: 'Section C',
      rfid: 'RF-C-120',
      reader: 'RC522-SEC-C',
      packageId: 'PKG_C001',
      time: '14:28:40',
      result: 'VERIFIED OCCUPIED'
    },
    {
      id: 'EVT-103',
      section: 'Section B',
      rfid: 'RF-B-442',
      reader: 'RC522-SEC-B',
      packageId: 'NONE',
      time: '14:15:02',
      result: 'STAND CLEAR (EMPTY)'
    },
    {
      id: 'EVT-104',
      section: 'Section D',
      rfid: 'RF-D-773',
      reader: 'RC522-SEC-D',
      packageId: 'NONE',
      time: '13:50:11',
      result: 'STAND CLEAR (EMPTY)'
    },
    {
      id: 'EVT-105',
      section: 'Counter Pallet',
      rfid: 'RF-CTR-501',
      reader: 'RC522-COUNTER',
      packageId: 'NONE',
      time: '14:10:00',
      result: 'STAND CLEAR (EMPTY)'
    }
  ]);

  const [activeScanSection, setActiveScanSection] = useState(null);

  const handleSimulateScan = (secCode) => {
    setActiveScanSection(secCode);
    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setPalletSections((prev) =>
        prev.map((s) => (s.code === secCode ? { ...s, lastScanTime: nowTime } : s))
      );

      const target = palletSections.find((s) => s.code === secCode);
      const newEvent = {
        id: `EVT-${Date.now().toString().slice(-3)}`,
        section: `Section ${secCode}`,
        rfid: target.rfidTagId,
        reader: target.scannerId,
        packageId: target.occupied && target.package ? target.package.id : 'NONE',
        time: nowTime,
        result: target.occupied ? 'VERIFIED OCCUPIED' : 'STAND CLEAR (EMPTY)'
      };

      setScanHistory((prev) => [newEvent, ...prev.slice(0, 9)]);
      setActiveScanSection(null);
    }, 1000);
  };

  const occupiedCount = palletSections.filter((s) => s.occupied).length;
  const emptyCount = palletSections.filter((s) => !s.occupied).length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Pallet Bays & Package Inventory
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-cyan border border-status-cyan/30">
              5 Physical Bays (A, B, C, D & Counter)
            </span>
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            Single-package constraint per section • RC522 RFID checkpoints & ESP32-CAM QR validation
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-status-cyan/15 text-status-cyan border border-status-cyan/30 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-status-cyan"></span>
            {occupiedCount} Occupied
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-industrial-800 text-industrial-300 border border-white/5 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-industrial-500"></span>
            {emptyCount} Empty
          </span>
        </div>
      </div>

      {/* 5 Dedicated Sections A, B, C, D & Counter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {palletSections.map((sec) => (
          <div key={sec.code} className="industrial-card overflow-hidden flex flex-col justify-between">
            {/* Card Banner Header */}
            <div className={`p-4 border-b border-white/5 font-mono flex items-center justify-between ${sec.headerBg}`}>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span className="font-extrabold text-sm uppercase tracking-wider text-white">{sec.name}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  sec.occupied
                    ? 'bg-status-cyan/20 text-status-cyan border-status-cyan/30 shadow-glow-cyan'
                    : 'bg-black/40 text-industrial-400 border-white/10'
                }`}
              >
                {sec.occupied ? 'OCCUPIED' : 'EMPTY'}
              </span>
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              {sec.occupied && sec.package ? (
                /* Occupied State */
                <div className="space-y-3 p-3.5 rounded-xl bg-industrial-900 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-industrial-400 block uppercase">
                        Active Stored Package
                      </span>
                      <h4 className="text-base font-extrabold text-white font-mono">{sec.package.id}</h4>
                      <span className="text-[10px] text-status-cyan font-mono font-semibold">
                        {sec.name} (1 Package Capacity)
                      </span>
                    </div>

                    {/* QR Code Simulation Box */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white text-black shadow-md">
                      <QrCode className="w-9 h-9" />
                      <span className="text-[7px] font-mono font-bold mt-0.5">{sec.package.qr}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-industrial-300">
                      <Boxes className="w-3.5 h-3.5 text-status-yellow" />
                      <span>Empty Box</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-industrial-300">
                      <Bot className="w-3.5 h-3.5 text-status-cyan" />
                      <span>{sec.package.assignedRobot || 'On Stand'}</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-industrial-400 bg-industrial-800/60 px-2 py-1 rounded border border-white/5 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-industrial-400">
                      <Weight className="w-3 h-3 text-status-yellow" /> Weight:
                    </span>
                    <span className="text-status-cyan font-semibold">Measured on lift (&le; 1.0 kg)</span>
                  </div>
                </div>
              ) : (
                /* Empty Bay State */
                <div className="p-6 rounded-xl bg-industrial-900/60 border border-dashed border-white/10 text-center flex flex-col items-center justify-center space-y-2 min-h-[140px]">
                  <Boxes className="w-8 h-8 text-industrial-600" />
                  <span className="text-xs font-mono font-bold text-industrial-400">Pallet Platform Empty</span>
                  <span className="text-[10px] font-mono text-industrial-500">
                    Available for Incoming Transport
                  </span>
                </div>
              )}

              {/* Hardware Scanner Specs & Trigger */}
              <div className="pt-2 border-t border-white/5 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-industrial-400">
                  <span>RFID Scanner:</span>
                  <span className="text-white font-semibold">{sec.scannerId}</span>
                </div>
                <div className="flex items-center justify-between text-industrial-400">
                  <span>RFID Tag ID:</span>
                  <span className="text-status-cyan font-semibold">{sec.rfidTagId}</span>
                </div>
                <div className="flex items-center justify-between text-industrial-400">
                  <span>Last Scanned:</span>
                  <span className="text-industrial-300">{sec.lastScanTime}</span>
                </div>

                <button
                  onClick={() => handleSimulateScan(sec.code)}
                  disabled={activeScanSection === sec.code}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-industrial-800 hover:bg-industrial-700 text-status-cyan text-xs font-bold border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${activeScanSection === sec.code ? 'animate-spin' : ''}`} />
                  <span>{activeScanSection === sec.code ? 'Scanning RFID...' : `Scan Section ${sec.code}`}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RFID Scanner Telemetry Log Table */}
      <div className="industrial-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Radio className="w-4 h-4 text-status-cyan" />
              RC522 RFID Pallet Reader Telemetry Log
            </h3>
            <p className="text-xs text-industrial-400 font-mono mt-0.5">
              Event records captured by station readers across sections A, B, C, D, and Counter Pallet
            </p>
          </div>
          <span className="text-xs font-mono text-status-green flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
            Sensors Calibrated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-industrial-900/60 text-industrial-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Section</th>
                <th className="py-2.5 px-3">Reader ID</th>
                <th className="py-2.5 px-3">RFID Tag ID</th>
                <th className="py-2.5 px-3">Detected Package</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scanHistory.map((evt) => (
                <tr key={evt.id} className="hover:bg-industrial-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{evt.id}</td>
                  <td className="py-2.5 px-3 text-status-cyan">{evt.section}</td>
                  <td className="py-2.5 px-3 text-industrial-300">{evt.reader}</td>
                  <td className="py-2.5 px-3 text-status-yellow font-bold">{evt.rfid}</td>
                  <td className="py-2.5 px-3 text-white">{evt.packageId}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.result.includes('OCCUPIED')
                          ? 'bg-status-cyan/20 text-status-cyan border border-status-cyan/30'
                          : 'bg-industrial-800 text-industrial-400 border border-white/5'
                      }`}
                    >
                      {evt.result}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-industrial-400">{evt.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pallets;
