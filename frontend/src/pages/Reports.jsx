import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Bot,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import jsPDF from 'jspdf';

const Reports = () => {
  const { robots, tasks } = useRobot();
  const [activeTab, setActiveTab] = useState('Task Report');
  const [selectedRobot, setSelectedRobot] = useState('All Robots');
  const [dateRange, setDateRange] = useState('01/01/2027 - 28/01/2027');

  // Chart Data matching Image 2 #8
  const taskTrendData = [
    { day: 'Jan 20', completed: 18, pending: 2 },
    { day: 'Jan 21', completed: 22, pending: 3 },
    { day: 'Jan 22', completed: 25, pending: 1 },
    { day: 'Jan 23', completed: 19, pending: 4 },
    { day: 'Jan 24', completed: 24, pending: 2 },
    { day: 'Jan 25', completed: 21, pending: 1 },
    { day: 'Jan 26', completed: 26, pending: 3 }
  ];

  const robotUtilizationData = [
    { name: 'Working', value: 65, color: '#10b981' },
    { name: 'Charging', value: 20, color: '#f97316' },
    { name: 'Idle', value: 12, color: '#00e5ff' },
    { name: 'Offline', value: 3, color: '#ef4444' }
  ];

  const batteryDischargeData = [
    { time: '08:00', RBT01: 100 },
    { time: '10:00', RBT01: 88 },
    { time: '12:00', RBT01: 75 },
    { time: '14:00', RBT01: 68 },
    { time: '16:00', RBT01: 58 }
  ];

  // Working Export CSV
  const handleExportCSV = () => {
    const headers = ['Task ID,Package,Robot,From,To,Status,Time\n'];
    const rows = tasks.map(
      (t) => `${t.id},${t.packageNo},${t.robot || 'None'},${t.from},${t.to},${t.status},${t.time}`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAW_BOT_Mission_Report_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Working Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('courier', 'bold');
    doc.text('RAW BOT — Autonomous Warehouse Robot Management System', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Scope: ${activeTab} • Robot: ${selectedRobot}`, 14, 34);
    doc.text('------------------------------------------------------------', 14, 40);

    let y = 50;
    doc.text('Task ID   | Package   | Robot   | From -> To | Status', 14, y);
    y += 8;
    tasks.slice(0, 15).forEach((t) => {
      doc.text(
        `${t.id.padEnd(9)}| ${(t.packageNo || '').padEnd(10)}| ${(t.robot || '-').padEnd(8)}| ${t.from} -> ${t.to}   | ${t.status}`,
        14,
        y
      );
      y += 8;
    });

    doc.save(`RAW_BOT_Industrial_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar with Filters and Export (Image 2 #8) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Industrial Analytics & Performance Reports
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            Throughput auditing, fleet duty cycles, and energy analytics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range input */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-industrial-850 border border-white/10 text-xs font-mono text-white">
            <Calendar className="w-4 h-4 text-status-cyan" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none text-white w-48 text-xs font-mono"
            />
          </div>

          {/* Robot Filter */}
          <select
            value={selectedRobot}
            onChange={(e) => setSelectedRobot(e.target.value)}
            className="px-3 py-2 rounded-xl bg-industrial-850 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-status-cyan"
          >
            <option value="All Robots">All Robots</option>
            <option value="RBT-01">RBT-01</option>
            <option value="RBT-02">RBT-02</option>
            <option value="RBT-03">RBT-03</option>
            <option value="RBT-04">RBT-04</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-industrial-800 hover:bg-industrial-700 text-white text-xs font-semibold border border-white/10 transition-colors"
            title="Download CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-status-green" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black text-xs font-bold shadow-glow-cyan transition-all"
            title="Download Official PDF Report"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs matching Image 2 #8 */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        {['Task Report', 'Robot Report', 'Battery Report'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === tab
                ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
                : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Metrics Row matching Image 2 #8 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="industrial-card p-4">
          <span className="text-industrial-400 text-xs uppercase block">Total Tasks</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-white">156</span>
          </div>
          <span className="text-[11px] text-industrial-400 mt-1 block">In selected period</span>
        </div>

        <div className="industrial-card p-4">
          <span className="text-industrial-400 text-xs uppercase block">Completed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-status-green">142</span>
            <span className="text-xs text-status-green font-bold">91%</span>
          </div>
          <span className="text-[11px] text-status-green mt-1 block">+12% vs last month</span>
        </div>

        <div className="industrial-card p-4">
          <span className="text-industrial-400 text-xs uppercase block">Failed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-status-red">03</span>
            <span className="text-xs text-status-red font-bold">2%</span>
          </div>
          <span className="text-[11px] text-industrial-400 mt-1 block">Obstacle halt timeout</span>
        </div>

        <div className="industrial-card p-4">
          <span className="text-industrial-400 text-xs uppercase block">Pending</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-status-yellow">11</span>
            <span className="text-xs text-status-yellow font-bold">7%</span>
          </div>
          <span className="text-[11px] text-industrial-400 mt-1 block">In scheduling queue</span>
        </div>
      </div>

      {/* Dynamic Report Charts */}
      {activeTab === 'Task Report' && (
        <div className="industrial-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Task Completion Trend (Daily Performance)
              </h3>
              <p className="text-xs text-industrial-400 font-mono">
                Completed missions vs pending queues per day
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-status-green"></span>
                <span className="text-white">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-status-yellow"></span>
                <span className="text-white">Pending</span>
              </div>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskTrendData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="day" stroke="#7e8b9e" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#7e8b9e" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11161d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'Robot Report' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="industrial-card p-5">
            <h3 className="text-sm font-bold text-white tracking-wide mb-4">
              Robot Fleet Duty Cycle & Utilization
            </h3>
            <div className="w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={robotUtilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {robotUtilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#11161d',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontFamily: 'monospace'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-white/5">
              {robotUtilizationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-industrial-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="industrial-card p-5 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white tracking-wide font-sans">
              Fleet Reliability Summary
            </h3>
            <div className="p-3 rounded-xl bg-industrial-900 border border-white/5 space-y-1">
              <span className="text-industrial-400 text-[10px] uppercase">Mean Distance Traveled</span>
              <p className="text-lg font-bold text-white">14.8 km / unit</p>
            </div>
            <div className="p-3 rounded-xl bg-industrial-900 border border-white/5 space-y-1">
              <span className="text-industrial-400 text-[10px] uppercase">Total Active Operating Hours</span>
              <p className="text-lg font-bold text-status-cyan">84.2 Hours</p>
            </div>
            <div className="p-3 rounded-xl bg-industrial-900 border border-white/5 space-y-1">
              <span className="text-industrial-400 text-[10px] uppercase">Autonomous Success Rate</span>
              <p className="text-lg font-bold text-status-green">98.1%</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Battery Report' && (
        <div className="industrial-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Battery Discharge & Charge Telemetry
              </h3>
              <p className="text-xs text-industrial-400 font-mono">
                Real-time 12.6V 3S LiPo battery level monitoring across fleet
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-status-cyan font-bold">RBT-01 (Active AMR)</span>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={batteryDischargeData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="time" stroke="#7e8b9e" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#7e8b9e" fontSize={11} domain={[0, 100]} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11161d',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontFamily: 'monospace'
                  }}
                />
                <Line type="monotone" dataKey="RBT01" name="RBT-01" stroke="#00e5ff" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
