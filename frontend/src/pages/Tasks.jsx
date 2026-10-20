import React, { useState } from 'react';
import { useRobot } from '../context/RobotContext';
import {
  ListTodo,
  Search,
  Plus,
  ArrowRight,
  Clock,
  Bot,
  Package,
  CheckCircle2,
  XCircle,
  PlayCircle,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const Tasks = () => {
  const { tasks, robots, packages, createTask, updateTaskStatus } = useRobot();
  const [activeTab, setActiveTab] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    packageNo: 'PKG_A001',
    from: 'Section A',
    to: 'Section C',
    robot: 'RBT-01',
    priority: 'HIGH'
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.packageNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.robot && t.robot.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSection =
      sectionFilter === 'All' ||
      t.from?.toLowerCase().includes(sectionFilter.toLowerCase()) ||
      t.to?.toLowerCase().includes(sectionFilter.toLowerCase());

    if (!matchesSection) return false;

    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Active') return matchesSearch && t.status === 'In Progress';
    if (activeTab === 'Completed') return matchesSearch && t.status === 'Completed';
    if (activeTab === 'Pending') return matchesSearch && t.status === 'Pending';
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-status-cyan/15 text-status-cyan border-status-cyan/30 shadow-glow-cyan';
      case 'Pending':
        return 'bg-status-yellow/15 text-status-yellow border-status-yellow/30';
      case 'Completed':
        return 'bg-status-green/15 text-status-green border-status-green/30';
      case 'Failed':
        return 'bg-status-red/15 text-status-red border-status-red/30';
      default:
        return 'bg-industrial-700 text-industrial-300 border-white/10';
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    createTask(formData);
    setShowModal(false);
  };

  const pipelineSteps = [
    'Select Package',
    'Find Package',
    'Assign Robot',
    'Navigate to Source',
    'Identify Package',
    'Pick Up Package',
    'Transport Package',
    'Drop Package',
    'Verify Delivery',
    'Complete Task'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Search and New Task (Image 2 #3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Task Management & Mission Control
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-industrial-800 text-status-cyan border border-status-cyan/30">
              {tasks.length} Total Missions
            </span>
          </h2>
          <p className="text-xs text-industrial-400 font-mono mt-0.5">
            Autonomous pick, transport, and drop scheduling pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search task, package, robot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-industrial-850 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-industrial-500 focus:outline-none focus:border-status-cyan font-mono w-56 sm:w-64"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-status-cyan hover:bg-cyan-400 text-black text-xs font-bold shadow-glow-cyan transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs & Section Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2">
          {['All', 'Active', 'Pending', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-status-cyan/15 text-status-cyan border border-status-cyan/30 shadow-glow-cyan'
                  : 'text-industrial-400 hover:text-white hover:bg-industrial-800/60'
              }`}
            >
              {tab === 'All' ? 'All Tasks' : tab}
            </button>
          ))}
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] flex-wrap">
          <span className="text-industrial-500 mr-1">Section:</span>
          {['All', 'Section A', 'Section B', 'Section C', 'Section D', 'Counter'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                sectionFilter === sec
                  ? 'bg-industrial-700 text-white font-bold border border-white/20'
                  : 'text-industrial-400 hover:text-white bg-industrial-850 border border-white/5'
              }`}
            >
              {sec.replace('Section ', 'Sec ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task Table */}
      <div className="industrial-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-industrial-900/80 text-[11px] text-industrial-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Task ID</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">From (Source)</th>
                <th className="py-3.5 px-4">To (Destination)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Robot</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4">Completed</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-industrial-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-status-cyan" />
                    {t.id}
                  </td>
                  <td className="py-4 px-4 text-status-cyan font-bold">{t.packageNo}</td>
                  <td className="py-4 px-4 text-industrial-200">
                    <span className="px-2 py-0.5 rounded bg-industrial-750 border border-white/5">{t.from}</span>
                  </td>
                  <td className="py-4 px-4 text-status-green font-bold">
                    <span className="px-2 py-0.5 rounded bg-industrial-750 border border-white/5">{t.to}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white">
                    {t.robot ? (
                      <span className="flex items-center gap-1.5 text-industrial-200">
                        <Bot className="w-3.5 h-3.5 text-status-cyan" />
                        {t.robot}
                      </span>
                    ) : (
                      <span className="text-industrial-500">— Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-industrial-400">{t.time || '10:30 AM'}</td>
                  <td className="py-4 px-4 text-industrial-400">
                    {t.status === 'Completed' ? (t.completedAt || t.eta || '11:05 AM') : '—'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {t.status === 'In Progress' && (
                      <button
                        onClick={() => updateTaskStatus(t.id, 'Completed')}
                        className="px-2.5 py-1 rounded bg-status-green/20 hover:bg-status-green/30 text-status-green border border-status-green/40 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Complete
                      </button>
                    )}
                    {t.status === 'Pending' && (
                      <button
                        onClick={() => updateTaskStatus(t.id, 'In Progress')}
                        className="px-2.5 py-1 rounded bg-status-cyan/20 hover:bg-status-cyan/30 text-status-cyan border border-status-cyan/40 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <PlayCircle className="w-3 h-3" /> Dispatch
                      </button>
                    )}
                    {t.status === 'Completed' && (
                      <span className="text-status-green font-semibold text-[11px]">✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Flow Pipeline Guide (Prompt Section #12 - 10 stages) */}
      <div className="industrial-card p-5">
        <h4 className="text-xs font-mono font-bold uppercase text-industrial-400 tracking-wider mb-4 flex items-center justify-between">
          <span>Autonomous Mission Workflow Pipeline (10 Stages)</span>
          <span className="text-status-cyan text-[10px] lowercase font-normal">verified delivery architecture</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step}
              className="p-2.5 rounded-xl bg-industrial-900 border border-white/5 flex flex-col items-center text-center relative"
            >
              <span className="text-[10px] font-mono text-status-cyan font-bold mb-1">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </span>
              <span className="text-[11px] font-semibold text-white leading-tight">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-industrial-850 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-industrial-400 hover:text-white rounded-lg bg-industrial-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-status-cyan" /> Create Autonomous Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-industrial-400 block mb-1">Select Package</label>
                <select
                  value={formData.packageNo}
                  onChange={(e) => setFormData({ ...formData, packageNo: e.target.value })}
                  className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — Sec {p.section} (Empty Box) [{p.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Source Location</label>
                  <select
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                    <option value="Section D">Section D</option>
                    <option value="Counter">Counter Pallet (Dispatch)</option>
                    <option value="HOME">HOME</option>
                  </select>
                </div>

                <div>
                  <label className="text-industrial-400 block mb-1">Destination Location</label>
                  <select
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  >
                    <option value="Counter">Counter Pallet (Dispatch)</option>
                    <option value="Section B">Section B</option>
                    <option value="Section A">Section A</option>
                    <option value="Section C">Section C</option>
                    <option value="Section D">Section D</option>
                    <option value="CH01">CH01 (Charger)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-industrial-400 block mb-1">Assign AMR Robot</label>
                  <select
                    value={formData.robot}
                    onChange={(e) => setFormData({ ...formData, robot: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  >
                    {Object.values(robots).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} ({r.status} - {r.battery}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-industrial-400 block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-industrial-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-status-cyan"
                  >
                    <option value="HIGH">HIGH (Urgent)</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-industrial-800 text-industrial-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-status-cyan text-black font-bold hover:bg-cyan-400 shadow-glow-cyan"
                >
                  START TASK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
