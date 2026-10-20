import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import Warehouse3D from '../components/Warehouse3D';
import StatCard from '../components/StatCard';
import { 
  Building2, 
  Boxes, 
  Layers, 
  Bot, 
  Zap, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Eye 
} from 'lucide-react';

const Warehouse = () => {
  const { packages, robots } = useRobot();
  const [selectedSection, setSelectedSection] = useState('SECTION A');

  const secCode = selectedSection ? selectedSection.replace('SECTION ', '').trim() : 'A';
  const sectionPackages = packages.filter((p) => p.section === secCode || (secCode === 'COUNTER' && (p.section === 'CTR' || p.location === 'Counter')));
  const robotList = Object.values(robots || {});

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Warehouse Facility & 3D Spatial Layout
          <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-cyan border border-status-cyan/30">
            Interactive Digital Twin
          </span>
        </h2>
        <p className="text-xs text-industrial-400 font-mono mt-0.5">
          Real-time physical storage racks, navigation lanes, and automated transfer bays
        </p>
      </div>

      {/* Top 4 Stat Cards matching warehouse setup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Pallet Stations"
          value="05"
          subtitle="Pallet A, B, C, D & Counter"
          icon={Boxes}
          accent="purple"
        />

        <StatCard
          title="Pallet Bays"
          value="05"
          subtitle="Sec A, B, C, D + Counter"
          icon={Layers}
          accent="cyan"
        />

        <StatCard
          title="Active Robots"
          value="01"
          subtitle="1 Autonomous Unit (RBT-01)"
          icon={Bot}
          accent="green"
        />

        <StatCard
          title="Charging Points"
          value="01"
          subtitle="CH01 Fast Dock Online"
          icon={Zap}
          accent="yellow"
        />
      </div>

      {/* 3D Warehouse Scene */}
      <div className="industrial-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Warehouse 3D Digital Twin View
              <span className="w-2 h-2 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
            </h3>
            <p className="text-xs text-industrial-400 font-mono">
              Drag to orbit camera • Scroll to zoom • Click racks to inspect storage
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['SECTION A', 'SECTION B', 'SECTION C', 'SECTION D', 'COUNTER'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedSection === sec
                    ? 'bg-status-cyan/20 text-status-cyan border border-status-cyan/40 shadow-glow-cyan'
                    : 'bg-industrial-800 text-industrial-400 hover:text-white border border-white/5'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <Warehouse3D
          onSelectSection={(secName) => setSelectedSection(secName)}
          activeSection={selectedSection}
          height="460px"
        />
      </div>

      {/* Selected Section Inventory Inspector */}
      <div className="industrial-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-status-cyan/15 border border-status-cyan/30 flex items-center justify-center text-status-cyan font-bold font-mono">
              {secCode}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {selectedSection} Inventory & Bay Telemetry
              </h3>
              <p className="text-xs text-industrial-400 font-mono">
                {sectionPackages.length > 0 ? '1 package stored at this section pallet stand' : '0 packages (Empty section pallet stand)'}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-status-green font-semibold">
            ✓ RFID Antenna Synced
          </span>
        </div>

        {sectionPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sectionPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-3.5 rounded-xl bg-industrial-900 border border-white/5 flex items-center justify-between font-mono text-xs"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-industrial-400 uppercase">Package</span>
                  <p className="font-bold text-white text-sm">{pkg.id}</p>
                  <div className="flex items-center gap-2 text-[11px] text-industrial-300">
                    <span className="text-status-cyan">Location: Section {pkg.section}</span>
                    <span>•</span>
                    <span className="text-industrial-400">Empty Box (Weight on lift)</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-green/15 text-status-green border border-status-green/30 font-bold">
                    {pkg.status}
                  </span>
                  <p className="text-[10px] text-industrial-500 mt-1">{pkg.rfid || 'RFID-OK'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-industrial-900/60 border border-dashed border-white/10 text-center font-mono">
            <Boxes className="w-8 h-8 text-industrial-600 mx-auto mb-2" />
            <p className="text-xs text-industrial-300 font-bold">
              {selectedSection} currently empty
            </p>
            <p className="text-[11px] text-industrial-500 mt-0.5">
              Pallet stand is clear and ready to receive incoming transported package
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehouse;
