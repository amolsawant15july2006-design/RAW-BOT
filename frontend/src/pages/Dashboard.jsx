import React from 'react';
import { useRobot } from '../context/RobotContext';
import StatCard from '../components/StatCard';
import Robot3D from '../components/Robot3D';
import RobotStatus from '../components/RobotStatus';
import TaskPanel from '../components/TaskPanel';
import BatteryLevelsChart from '../components/BatteryLevelsChart';
import RecentActivities from '../components/RecentActivities';
import { 
  Bot, 
  CheckSquare, 
  Boxes, 
  BatteryCharging, 
  ShieldCheck,
  Maximize2,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { robots, tasks, primaryRobot, batterySaverMode, toggleBatterySaverMode } = useRobot();

  const robotsList = Object.values(robots || {});
  const onlineRobots = robotsList.filter(r => r.status === 'Working' || r.status === 'Moving' || r.status === 'Idle').length;
  const chargingRobots = robotsList.filter(r => r.status === 'Charging').length;

  const activeTasksCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedTodayCount = tasks.filter(t => t.status === 'Completed').length + 12;

  const avgBattery = Math.round(
    robotsList.reduce((acc, curr) => acc + (curr.battery || 0), 0) / (robotsList.length || 1)
  );

  const isLiftUp = primaryRobot?.lift === 'UP';
  const isEmergency = primaryRobot?.status === 'Emergency Stop';
  const isWorking = primaryRobot?.status === 'Working' || primaryRobot?.status === 'Moving';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Bar with Battery Saver Option */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-white font-mono tracking-wide">
            Autonomous Fleet Telemetry
          </span>
          <span className="text-industrial-600">•</span>
          <span className="text-[11px] font-mono text-industrial-400">
            1 AGV Robot • 5 Pallets (A, B, C, D & Counter)
          </span>
        </div>

        {/* Battery Saver Option Toggle Button */}
        <button
          onClick={toggleBatterySaverMode}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
            batterySaverMode
              ? 'bg-status-green/20 text-status-green border-status-green/50 shadow-glow-green'
              : 'bg-industrial-850 hover:bg-industrial-800 text-industrial-300 border-white/10 hover:text-white'
          }`}
          title="Toggle Battery Saver Eco Mode (Throttles speed to 0.4 m/s to extend runtime to ~8.2 hrs)"
        >
          <Leaf className={`w-3.5 h-3.5 ${batterySaverMode ? 'text-status-green animate-pulse' : 'text-industrial-400'}`} />
          <span>Battery Saver:</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
            batterySaverMode ? 'bg-status-green text-black' : 'bg-industrial-700 text-industrial-300'
          }`}>
            {batterySaverMode ? 'ECO ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* 1. TOP KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <StatCard
          title="Fleet Robots"
          value={`0${robotsList.length}`}
          subtitle={`${onlineRobots} Online • 1 Autonomous Unit`}
          icon={Bot}
          accent="cyan"
        />

        <StatCard
          title="Active Missions"
          value={`0${activeTasksCount}`}
          subtitle={`${activeTasksCount} In Progress • 0 Queued`}
          icon={CheckSquare}
          accent="green"
        />

        <StatCard
          title="Pallets Handled"
          value={`${completedTodayCount}`}
          badge="+20% Vol"
          subtitle="A, B, C, D & Counter Stations"
          icon={Boxes}
          accent="purple"
        />

        <StatCard
          title="Battery Health"
          value={`${avgBattery}%`}
          badge={batterySaverMode ? "ECO ACTIVE" : null}
          subtitle={batterySaverMode ? "Eco Mode • ~8.2 hrs (+50%)" : "Nominal • 24.2V LiFePO4"}
          icon={BatteryCharging}
          accent="yellow"
        />

        <StatCard
          title="Safety Interlock"
          value="ACTIVE"
          badge="≤1.0 kg"
          subtitle="Overweight Auto-Cutoff"
          icon={ShieldCheck}
          accent="green"
        />
      </div>

      {/* 3. MIDDLE ROW: 3D Live Robot View + Robot Status R01 + Task Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Live Robot View 3D Canvas */}
        <div className="lg:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-industrial-850/90 via-industrial-900/90 to-industrial-950/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/15 p-5 sm:p-6 shadow-industrial-card flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-wide font-mono flex items-center gap-2">
                  3D Digital Twin
                  <span className="w-2 h-2 rounded-full bg-status-cyan shadow-glow-cyan animate-pulse"></span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-cyan/15 text-status-cyan border border-status-cyan/30">
                  Interactive Telemetry
                </span>
              </div>
              <p className="text-[11px] text-industrial-400 font-mono mt-0.5">
                Real-Time Physical State • Model {primaryRobot.id || 'RBT-01'}
              </p>
            </div>

            <Link
              to="/warehouse"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-industrial-800 hover:bg-industrial-750 text-industrial-300 hover:text-white border border-white/10 text-xs font-mono font-semibold transition-all shadow-sm"
              title="Open Full 3D Warehouse Simulation"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full 3D</span>
            </Link>
          </div>

          {/* 3D Viewport with HUD Telemetry Overlay */}
          <div className="relative flex-1 min-h-[360px] rounded-2xl overflow-hidden border border-white/[0.08] bg-industrial-950 shadow-inner group">
            <Robot3D
              status={primaryRobot.status}
              lift={primaryRobot.lift}
              height="380px"
              autoRotate={true}
              interactive={true}
              showControls={true}
            />

            {/* HUD Overlay: Bottom Left Payload & Actuator State */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-industrial-900/85 backdrop-blur-md border border-white/10 text-xs font-mono shadow-lg">
                <span className="text-industrial-400">Actuator:</span>
                <span className={`font-bold ${isLiftUp ? 'text-status-green' : 'text-industrial-300'}`}>
                  {isLiftUp ? 'UP (350mm)' : 'DOWN (50mm)'}
                </span>
                <span className="text-industrial-600">|</span>
                <span className="text-industrial-400">Weight:</span>
                <span className={`font-bold ${primaryRobot.weight > 1.0 ? 'text-status-red' : 'text-white'}`}>
                  {primaryRobot.lift === 'UP' || primaryRobot.weight > 0 ? `${primaryRobot.weight} kg` : '0.20 kg'}
                </span>
              </div>
            </div>

            {/* HUD Overlay: Top Left Location Coordinates */}
            <div className="absolute top-3 left-3 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-industrial-900/85 backdrop-blur-md border border-white/10 text-[11px] font-mono shadow-md">
                <span className={`w-1.5 h-1.5 rounded-full ${isEmergency ? 'bg-status-red' : isWorking ? 'bg-status-green' : 'bg-status-cyan'} animate-pulse`}></span>
                <span className="text-white font-bold">
                  {primaryRobot?.currentLocation || 'Section A'} ➔ {primaryRobot?.destination || 'Counter'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Robot Status - R01 Hardware Control */}
        <div className="lg:col-span-3">
          <RobotStatus robotId="RBT-01" />
        </div>

        {/* Task Information Panel */}
        <div className="lg:col-span-3">
          <TaskPanel />
        </div>
      </div>

      {/* 3. BOTTOM ROW: Battery Health & Electrical Telemetry + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Battery Health & Electrical Telemetry */}
        <BatteryLevelsChart />

        {/* Recent Activities Timeline */}
        <RecentActivities />
      </div>
    </div>
  );
};

export default Dashboard;
