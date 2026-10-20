import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { database, isFirebaseConfigured, ref, onValue, off, set, update } from '../firebase/firebase';
import { robotApi, taskApi, packageApi, alertApi, simulationApi, healthApi } from '../services/api';

const RobotContext = createContext();

const INITIAL_ROBOTS = {
  'RBT-01': {
    id: 'RBT-01',
    name: 'Robot 1',
    status: 'Working',
    battery: 85,
    currentLocation: 'Section A',
    destination: 'Counter',
    currentTask: 'Pick & Place',
    taskId: 'T-001',
    packageId: 'PKG_A001',
    lift: 'UP',
    weight: 0.20,
    speed: 0.8,
    mode: 'AUTO',
    lastUpdate: new Date().toLocaleTimeString(),
    sensors: {
      ultrasonic: 45,
      irLeft: false,
      irRight: false,
      rfid: 'RFID-SEC-A',
      qrCamera: 'PKG_A001',
      encoderLeft: 1240,
      encoderRight: 1238,
      linearActuator: 'EXTENDED'
    }
  }
};

const INITIAL_TASKS = [
  { id: 'T-001', packageNo: 'PKG_A001', from: 'Section A', to: 'Counter', status: 'In Progress', robot: 'RBT-01', time: '10:30 AM', eta: '10:35 AM', priority: 'HIGH', progress: 65, step: 'Transporting to Counter' },
  { id: 'T-002', packageNo: 'PKG_C001', from: 'Section C', to: 'Section D', status: 'Pending', robot: 'RBT-01', time: '14:40', eta: '14:50', priority: 'MEDIUM', progress: 0, step: 'Queued for RBT-01' },
  { id: 'T-003', packageNo: 'PKG_A001', from: 'Counter', to: 'Section B', status: 'Completed', robot: 'RBT-01', time: '13:45', eta: '13:45', priority: 'NORMAL', progress: 100, step: 'Completed' }
];

const INITIAL_PACKAGES = [
  { id: 'PKG_A001', section: 'A', location: 'Section A', qr: 'PKG_A001', rfid: 'RF-A-984', type: 'Empty Box', status: 'IN_TRANSIT', assignedRobot: 'RBT-01' },
  { id: 'PKG_C001', section: 'C', location: 'Section C', qr: 'PKG_C001', rfid: 'RF-C-120', type: 'Empty Box', status: 'AVAILABLE', assignedRobot: null }
];

const INITIAL_ALERTS = [
  { id: 'ALT-01', time: '14:25', type: 'Critical', message: 'Obstacle Detected — HC-SR04 front range 18cm (Motor Cutoff)', robotId: 'RBT-01', status: 'Unread' },
  { id: 'ALT-02', time: '13:50', type: 'Critical', message: 'Weight Warning: Package weight is more than 1 kg (Limit: 1.0 kg) — Lift aborted', robotId: 'RBT-01', status: 'Unread' },
  { id: 'ALT-03', time: '12:30', type: 'Info', message: 'Task completed — PKG_A001 dropped at Counter Pallet', robotId: 'RBT-01', status: 'Read' },
  { id: 'ALT-04', time: '11:15', type: 'Warning', message: 'RFID detected — Pallet A scanned by RC522-SEC-A', robotId: 'RBT-01', status: 'Read' },
  { id: 'ALT-05', time: '10:05', type: 'Info', message: 'Robot initialized — RBT-01 ready for missions', robotId: 'RBT-01', status: 'Read' }
];

export const RobotProvider = ({ children }) => {
  const [robots, setRobots] = useState(INITIAL_ROBOTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [simulationMode, setSimulationMode] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [backendConnected, setBackendConnected] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(isFirebaseConfigured);
  const [robotConnected, setRobotConnected] = useState(true);
  const [batterySaverMode, setBatterySaverMode] = useState(false);

  const waypoints = ['Section A', 'Section B', 'Section C', 'Section D', 'Counter', 'CH01'];
  const stepRef = useRef(0);

  const toggleBatterySaverMode = () => {
    setBatterySaverMode((prev) => {
      const next = !prev;
      setRobots((curr) => {
        const updated = { ...curr };
        const r1 = { ...updated['RBT-01'] };
        if (r1) {
          r1.mode = next ? 'ECO' : 'AUTO';
          r1.speed = next ? 0.4 : 0.8;
        }
        updated['RBT-01'] = r1;
        return updated;
      });
      return next;
    });
  };

  // Health and backend check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await healthApi.check();
        if (res.data && res.data.status === 'ONLINE') {
          setBackendConnected(true);
          if (res.data.firebaseConnected) {
            setFirebaseConnected(true);
          }
        }
      } catch (err) {
        setBackendConnected(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // Firebase Realtime Listeners (if configured)
  useEffect(() => {
    if (isFirebaseConfigured && database) {
      try {
        const robotRef = ref(database, 'robots');
        const tasksRef = ref(database, 'tasks');
        const alertsRef = ref(database, 'alerts');

        const unsubRobots = onValue(robotRef, (snapshot) => {
          const val = snapshot.val();
          if (val) setRobots(val);
        });

        const unsubTasks = onValue(tasksRef, (snapshot) => {
          const val = snapshot.val();
          if (val) setTasks(Array.isArray(val) ? val : Object.values(val));
        });

        const unsubAlerts = onValue(alertsRef, (snapshot) => {
          const val = snapshot.val();
          if (val) setAlerts(Array.isArray(val) ? val : Object.values(val));
        });

        return () => {
          off(robotRef);
          off(tasksRef);
          off(alertsRef);
        };
      } catch (e) {
        console.warn('Firebase realtime listener error:', e);
      }
    }
  }, []);

  // Autonomous Simulation Loop for Realtime Visuals
  useEffect(() => {
    if (!simulationMode) return;

    const interval = setInterval(() => {
      setRobots((prev) => {
        const updated = { ...prev };
        const r1 = { ...updated['RBT-01'] };
        if (r1 && (r1.status === 'Working' || r1.status === 'Moving')) {
          stepRef.current = (stepRef.current + 1) % waypoints.length;
          const curr = waypoints[stepRef.current];
          const dest = waypoints[(stepRef.current + 1) % waypoints.length];
          r1.currentLocation = curr;
          r1.destination = dest;
          const drainRate = batterySaverMode ? 0.05 : 0.2;
          r1.speed = batterySaverMode ? 0.4 : 0.8;
          r1.mode = batterySaverMode ? 'ECO' : 'AUTO';
          r1.battery = Math.max(15, Math.round((r1.battery - drainRate) * 10) / 10);
          r1.lastUpdate = new Date().toLocaleTimeString();

          if (curr === 'Section B') {
            r1.lift = 'DOWN';
            r1.weight = 0.0;
            r1.currentTask = 'Drop Package PKG_A001';
          } else if (curr === 'Section A') {
            // In physical prototype: weight is measured by load cell AFTER lifting empty box
            const measuredWeight = 0.20; // Empty box weight (under 1.0 kg)
            if (measuredWeight <= 1.0) {
              r1.lift = 'UP';
              r1.weight = measuredWeight;
              r1.currentTask = `Lifted Empty Box (${measuredWeight} kg — OK)`;
            } else {
              // Safety interlock: if package weight is more than 1 kg, abort lift and trigger dashboard alert
              r1.lift = 'DOWN';
              r1.weight = measuredWeight;
              r1.status = 'Idle';
              triggerOverweightAlert('RBT-01', measuredWeight);
            }
          } else if (curr === 'Counter') {
            r1.lift = 'DOWN';
            r1.weight = 0.0;
            r1.currentTask = 'Deliver to Counter';
          }
          updated['RBT-01'] = r1;
        }

        return updated;
      });
    }, 3500 / simulationSpeed);

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, batterySaverMode]);

  // Execute Robot Command
  const sendRobotCommand = async (robotId, command, extra = {}) => {
    try {
      if (backendConnected) {
        await robotApi.sendCommand(robotId, command, extra);
      }
    } catch (e) {
      console.warn('Backend command call failed, executing locally:', e.message);
    }

    setRobots((prev) => {
      const robot = prev[robotId] ? { ...prev[robotId] } : null;
      if (!robot) return prev;

      let newStatus = robot.status;
      let newSpeed = robot.speed;

      if (command === 'START' || command === 'RESUME') {
        newStatus = 'Working';
        newSpeed = 0.8;
      } else if (command === 'STOP' || command === 'PAUSE') {
        newStatus = 'Idle';
        newSpeed = 0.0;
      } else if (command === 'EMERGENCY_STOP') {
        newStatus = 'Emergency Stop';
        newSpeed = 0.0;
        triggerEmergencyStop(robotId);
      } else if (command === 'CHARGE') {
        newStatus = 'Moving to Charger';
        robot.destination = 'CH01';
        robot.currentTask = 'Docking at CH01';
        newSpeed = 0.5;
      }

      return {
        ...prev,
        [robotId]: {
          ...robot,
          status: newStatus,
          speed: newSpeed,
          lastUpdate: new Date().toLocaleTimeString(),
          ...extra
        }
      };
    });
  };

  const triggerEmergencyStop = (robotId = 'RBT-01') => {
    const alertItem = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Critical',
      message: `Emergency Stop Activated for ${robotId}`,
      robotId,
      status: 'Unread'
    };
    setAlerts((prev) => [alertItem, ...prev]);
  };

  const triggerSimulatedObstacle = (robotId = 'RBT-01') => {
    sendRobotCommand(robotId, 'PAUSE');
    const alertItem = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Warning',
      message: `Obstacle Detected — ${robotId} halted at 18cm range`,
      robotId,
      status: 'Unread'
    };
    setAlerts((prev) => [alertItem, ...prev]);
  };

  const triggerOverweightAlert = (robotId = 'RBT-01', measuredWeight = 1.45) => {
    sendRobotCommand(robotId, 'PAUSE', { lift: 'DOWN', weight: measuredWeight });
    const alertItem = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Critical',
      message: `Weight Warning: Package weight is more than 1 kg (Detected: ${measuredWeight} kg) — Lift aborted`,
      robotId,
      status: 'Unread'
    };
    setAlerts((prev) => [alertItem, ...prev]);
  };

  const addAlert = (type, message, robotId = 'RBT-01') => {
    const alertItem = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      message,
      robotId,
      status: 'Unread'
    };
    setAlerts((prev) => [alertItem, ...prev]);
  };

  const createTask = async (taskData) => {
    const newId = `T-00${tasks.length + 1}`;
    const newTask = {
      id: newId,
      packageNo: taskData.packageNo,
      from: taskData.from,
      to: taskData.to,
      status: 'In Progress',
      robot: taskData.robot || 'RBT-01',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eta: '10 mins',
      priority: taskData.priority || 'HIGH',
      progress: 10,
      step: 'Assigned & Navigating'
    };

    setTasks((prev) => [newTask, ...prev]);

    // Send robot
    if (taskData.robot) {
      sendRobotCommand(taskData.robot, 'START', {
        destination: taskData.to,
        currentTask: `Transport ${taskData.packageNo} (${taskData.from} → ${taskData.to})`,
        taskId: newId,
        packageId: taskData.packageNo
      });
    }

    try {
      if (backendConnected) {
        await taskApi.create(taskData);
      }
    } catch (e) {
      console.warn('Backend task create failed:', e.message);
    }
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, progress: status === 'Completed' ? 100 : t.progress } : t))
    );
  };

  const markAlertRead = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Read' } : a)));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <RobotContext.Provider
      value={{
        robots,
        primaryRobot: robots['RBT-01'] || INITIAL_ROBOTS['RBT-01'],
        tasks,
        packages,
        alerts,
        unreadAlertsCount: alerts.filter((a) => a.status === 'Unread').length,
        simulationMode,
        simulationSpeed,
        backendConnected,
        firebaseConnected,
        robotConnected,
        setSimulationMode,
        setSimulationSpeed,
        sendRobotCommand,
        triggerEmergencyStop,
        triggerSimulatedObstacle,
        triggerOverweightAlert,
        createTask,
        updateTaskStatus,
        markAlertRead,
        batterySaverMode,
        setBatterySaverMode,
        toggleBatterySaverMode,
        addAlert
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = () => useContext(RobotContext);
