import React, { useState, useEffect, useRef } from 'react';
import { hardwareApi } from '../services/api';
import {
  Wifi,
  WifiOff,
  Radio,
  AlertTriangle,
  Play,
  Square,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Settings,
  RefreshCw
} from 'lucide-react';

const HardwareBridge = () => {
  const [espIp, setEspIp] = useState('192.168.4.1');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('CHECKING'); // ONLINE, OFFLINE, CHECKING
  const [activeDir, setActiveDir] = useState('S');
  const [distances, setDistances] = useState({ front: null, back: null, left: null, right: null });
  const [lastMessage, setLastMessage] = useState('Ready for hardware commands');
  const [isEStop, setIsEStop] = useState(false);
  const heartbeatTimer = useRef(null);

  // Poll distances & status periodically
  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const res = await hardwareApi.getStatus();
        if (isMounted) {
          if (res.data.success && res.data.bridge === 'ONLINE') {
            setBridgeStatus('ONLINE');
            if (res.data.distances) setDistances(res.data.distances);
          } else {
            setBridgeStatus('OFFLINE');
          }
        }
      } catch (err) {
        if (isMounted) setBridgeStatus('OFFLINE');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
    };
  }, []);

  const handleUpdateIp = async (e) => {
    e.preventDefault();
    try {
      await hardwareApi.setConfig({ ip: espIp });
      setLastMessage(`Target updated to ${espIp}. Testing connection...`);
      setIsConfigOpen(false);
      const res = await hardwareApi.getStatus();
      setBridgeStatus(res.data.success ? 'ONLINE' : 'OFFLINE');
    } catch (err) {
      setLastMessage(`Error configuring IP: ${err.message}`);
    }
  };

  const handleMove = async (dir) => {
    if (isEStop && dir !== 'S') return;
    setActiveDir(dir);

    // Stop previous heartbeat
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }

    try {
      const res = await hardwareApi.move(dir);
      if (dir === 'S') {
        setLastMessage('Robot stopped.');
      } else {
        setLastMessage(`Moving [${dir}] — Hardware executing`);
        // Start heartbeat to keep movement alive if supported
        heartbeatTimer.current = setInterval(async () => {
          try {
            await hardwareApi.heartbeat();
          } catch (e) {
            handleMove('S');
          }
        }, 350);
      }
    } catch (err) {
      setActiveDir('S');
      const errorMsg = err.response?.data?.message || err.message;
      setLastMessage(`Command blocked: ${errorMsg}`);
    }
  };

  const handleEmergencyStop = async () => {
    setIsEStop(true);
    setActiveDir('S');
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }

    try {
      await hardwareApi.emergency();
      setLastMessage('⚠️ CRITICAL: Hardware Emergency Stop latched!');
    } catch (err) {
      setLastMessage('Emergency Stop request failed — Check robot manually!');
    }
  };

  const getDistanceColor = (val) => {
    if (val === null || val === undefined || val < 0) return 'text-industrial-400';
    if (val <= 20) return 'text-status-red font-bold animate-pulse';
    if (val <= 40) return 'text-status-yellow';
    return 'text-status-cyan';
  };

  const formatDistance = (val) => {
    if (val === null || val === undefined) return '--';
    if (val < 0) return 'NO ECHO';
    if (val >= 900) return '> 200';
    return Number(val).toFixed(1);
  };

  return (
    <div className="industrial-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Radio className="w-5 h-5 text-status-cyan animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Physical ESP32 Master Teleoperation Deck
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                bridgeStatus === 'ONLINE'
                  ? 'bg-status-green/20 text-status-green border-status-green/40'
                  : 'bg-status-orange/20 text-status-orange border-status-orange/40'
              }`}>
                {bridgeStatus === 'ONLINE' ? '● ESP32 LINKED' : '○ ESP32 STANDBY / AP'}
              </span>
            </h3>
            <p className="text-[11px] text-industrial-400 font-mono">
              Direct Mecanum drive & 4-sensor ultrasonic radar for ESP32 + MCP23017
            </p>
          </div>
        </div>

        {/* IP Config Toggle */}
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-industrial-800 text-industrial-300 hover:text-white border border-white/10 text-xs font-mono transition-all self-start sm:self-auto"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>IP: {espIp}</span>
        </button>
      </div>

      {/* IP Configuration Bar */}
      {isConfigOpen && (
        <form onSubmit={handleUpdateIp} className="p-3 rounded-xl bg-industrial-900 border border-white/10 space-y-2 text-xs font-mono animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-industrial-400 whitespace-nowrap">ESP32 IP Address:</span>
            <input
              type="text"
              value={espIp}
              onChange={(e) => setEspIp(e.target.value)}
              placeholder="e.g. 192.168.4.1 or 192.168.1.150"
              className="bg-industrial-800 border border-white/20 rounded-lg px-3 py-1.5 text-white flex-1 w-full focus:outline-none focus:border-status-cyan"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-status-cyan text-industrial-950 font-bold hover:bg-cyan-400 transition-all w-full sm:w-auto"
            >
              Update IP
            </button>
          </div>
          <p className="text-[10px] text-industrial-400">
            • Default AP Mode IP: <code className="text-status-cyan">192.168.4.1</code> (Connect PC Wi-Fi to RAW_BOT)
            <br />
            • Router / Hotspot Station Mode: Check Arduino Serial Monitor for the assigned IP (e.g. <code className="text-status-cyan">192.168.1.X</code>)
          </p>
        </form>
      )}

      {/* Main Grid: Distances on Left, Directional Controls on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: 4-Way Ultrasonic Radar Cards */}
        <div className="md:col-span-5 space-y-2">
          <div className="text-[11px] font-mono text-industrial-400 uppercase tracking-wider flex items-center justify-between">
            <span>Ultrasonic Sensor Grid</span>
            <span className="text-[10px] text-status-cyan">Stop: 20cm</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            {/* Front */}
            <div className="col-span-2 p-2.5 rounded-xl bg-industrial-900 border border-white/5">
              <span className="text-[10px] text-industrial-400 uppercase block">Front Sensor</span>
              <span className={`text-xl font-bold ${getDistanceColor(distances.front)}`}>
                {formatDistance(distances.front)}
              </span>
              <span className="text-[10px] text-industrial-500 ml-1">cm</span>
            </div>

            {/* Left */}
            <div className="p-2.5 rounded-xl bg-industrial-900 border border-white/5">
              <span className="text-[10px] text-industrial-400 uppercase block">Left Sensor</span>
              <span className={`text-lg font-bold ${getDistanceColor(distances.left)}`}>
                {formatDistance(distances.left)}
              </span>
              <span className="text-[10px] text-industrial-500 ml-1">cm</span>
            </div>

            {/* Right */}
            <div className="p-2.5 rounded-xl bg-industrial-900 border border-white/5">
              <span className="text-[10px] text-industrial-400 uppercase block">Right Sensor</span>
              <span className={`text-lg font-bold ${getDistanceColor(distances.right)}`}>
                {formatDistance(distances.right)}
              </span>
              <span className="text-[10px] text-industrial-500 ml-1">cm</span>
            </div>

            {/* Back */}
            <div className="col-span-2 p-2.5 rounded-xl bg-industrial-900 border border-white/5">
              <span className="text-[10px] text-industrial-400 uppercase block">Back Sensor</span>
              <span className={`text-xl font-bold ${getDistanceColor(distances.back)}`}>
                {formatDistance(distances.back)}
              </span>
              <span className="text-[10px] text-industrial-500 ml-1">cm</span>
            </div>
          </div>
        </div>

        {/* Right: Directional D-Pad & Actuators */}
        <div className="md:col-span-7 flex flex-col items-center space-y-3">
          <div className="text-[11px] font-mono text-industrial-400 uppercase tracking-wider text-center">
            Mecanum Directional Actuation Matrix
          </div>

          {/* 3x3 D-Pad */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[260px]">
            {/* Row 1 */}
            <div></div>
            <button
              onClick={() => handleMove('F')}
              className={`p-3.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all ${
                activeDir === 'F'
                  ? 'bg-status-cyan text-industrial-950 border-status-cyan shadow-glow-cyan'
                  : 'bg-industrial-850 hover:bg-industrial-800 text-white border-white/10'
              }`}
            >
              <ArrowUp className="w-5 h-5 mb-0.5" />
              <span>FWD</span>
            </button>
            <div></div>

            {/* Row 2 */}
            <button
              onClick={() => handleMove('L')}
              className={`p-3.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all ${
                activeDir === 'L'
                  ? 'bg-status-cyan text-industrial-950 border-status-cyan shadow-glow-cyan'
                  : 'bg-industrial-850 hover:bg-industrial-800 text-white border-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mb-0.5" />
              <span>LEFT</span>
            </button>

            <button
              onClick={() => handleMove('S')}
              className="p-3.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center border bg-status-red/20 hover:bg-status-red/30 text-status-red border-status-red/40 transition-all shadow-glow-red"
            >
              <Square className="w-5 h-5 mb-0.5" />
              <span>STOP</span>
            </button>

            <button
              onClick={() => handleMove('R')}
              className={`p-3.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all ${
                activeDir === 'R'
                  ? 'bg-status-cyan text-industrial-950 border-status-cyan shadow-glow-cyan'
                  : 'bg-industrial-850 hover:bg-industrial-800 text-white border-white/10'
              }`}
            >
              <ArrowRight className="w-5 h-5 mb-0.5" />
              <span>RIGHT</span>
            </button>

            {/* Row 3 */}
            <div></div>
            <button
              onClick={() => handleMove('B')}
              className={`p-3.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition-all ${
                activeDir === 'B'
                  ? 'bg-status-cyan text-industrial-950 border-status-cyan shadow-glow-cyan'
                  : 'bg-industrial-850 hover:bg-industrial-800 text-white border-white/10'
              }`}
            >
              <ArrowDown className="w-5 h-5 mb-0.5" />
              <span>BACK</span>
            </button>
            <div></div>
          </div>

          {/* Mecanum Rotation Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-[260px]">
            <button
              onClick={() => handleMove('A')}
              className={`py-2 px-3 rounded-xl font-bold text-[11px] font-mono flex items-center justify-center gap-1.5 border transition-all ${
                activeDir === 'A'
                  ? 'bg-status-cyan text-industrial-950 border-status-cyan'
                  : 'bg-industrial-850 hover:bg-industrial-800 text-white border-white/10'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rot Anti-CW</span>
            </button>

            <button
              onClick={() => handleMove('C')}
              className={`py-2 px-3 rounded-xl font-bold text-[11px] font-mono flex items-center justify-center gap-1.5 border transition-all ${
                activeDir === 'C'
                  ? 'bg-status-cyan text-industrial-950 border-status-cyan'
                  : 'bg-industrial-850 hover:bg-industrial-800 text-white border-white/10'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rot CW</span>
            </button>
          </div>

          {/* Emergency Stop Button */}
          <button
            onClick={handleEmergencyStop}
            className="w-full max-w-[260px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-glow-red flex items-center justify-center gap-2 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Hardware E-STOP</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2.5 rounded-xl bg-industrial-900 border border-white/5 flex items-center justify-between text-xs font-mono">
        <span className="text-industrial-400">Hardware Telemetry:</span>
        <span className="text-status-cyan font-semibold">{lastMessage}</span>
      </div>
    </div>
  );
};

export default HardwareBridge;
