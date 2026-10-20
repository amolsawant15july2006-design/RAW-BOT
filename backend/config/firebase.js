const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let dbInstance = null;
let isRealFirebase = false;

// Default initial database state matching Section #25 of Project Requirements
const initialDatabaseState = {
  robot: {
    command: "START",
    status: "MOVING",
    battery: 78,
    weight: 0.20,
    currentLocation: "Section A",
    destination: "Section B",
    lift: "UP",
    error: ""
  },
  robots: {
    "RBT-01": {
      id: "RBT-01",
      name: "Robot 1",
      status: "Working", // Working, Charging, Idle, Offline
      battery: 85,
      currentLocation: "Section A",
      destination: "Counter",
      currentTask: "Pick & Place",
      taskId: "T-001",
      packageId: "PKG_A001",
      lift: "UP",
      weight: 0.20,
      speed: 0.8,
      mode: "AUTO",
      lastUpdate: new Date().toISOString(),
      sensors: {
        ultrasonic: 45, // cm
        irLeft: false,
        irRight: false,
        rfid: "RFID-SEC-A",
        qrCamera: "PKG_A001",
        encoderLeft: 1240,
        encoderRight: 1238,
        linearActuator: "EXTENDED"
      }
    }
  },
  packages: {
    "PKG_A001": {
      id: "PKG_A001",
      section: "A",
      location: "Section A",
      qr: "PKG_A001",
      rfid: "RF-A-984",
      type: "Empty Box",
      status: "IN_TRANSIT",
      assignedRobot: "RBT-01"
    },
    "PKG_C001": {
      id: "PKG_C001",
      section: "C",
      location: "Section C",
      qr: "PKG_C001",
      rfid: "RF-C-120",
      type: "Empty Box",
      status: "AVAILABLE",
      assignedRobot: null
    }
  },
  tasks: {
    "T-001": {
      id: "T-001",
      packageNo: "PKG_A001",
      from: "Section A",
      to: "Counter",
      status: "In Progress", // In Progress, Pending, Completed, Failed
      robot: "RBT-01",
      time: "10:30 AM",
      eta: "10:35 AM",
      priority: "HIGH",
      progress: 65,
      step: "Transporting to Counter"
    },
    "T-002": {
      id: "T-002",
      packageNo: "PKG_C001",
      from: "Section C",
      to: "Section D",
      status: "Pending",
      robot: "RBT-01",
      time: "14:40",
      eta: "14:50",
      priority: "MEDIUM",
      progress: 0,
      step: "Queued for RBT-01"
    },
    "T-003": {
      id: "T-003",
      packageNo: "PKG_A001",
      from: "Counter",
      to: "Section B",
      status: "Completed",
      robot: "RBT-01",
      time: "13:45",
      eta: "13:45",
      priority: "NORMAL",
      progress: 100,
      step: "Completed"
    }
  },
  locations: {
    "Section A": { id: "Section A", code: "A", label: "Pallet A", x: 120, y: 150, section: "A", package: "PKG_A001", status: "OCCUPIED" },
    "Section B": { id: "Section B", code: "B", label: "Pallet B", x: 380, y: 150, section: "B", package: null, status: "EMPTY" },
    "Section C": { id: "Section C", code: "C", label: "Pallet C", x: 120, y: 320, section: "C", package: "PKG_C001", status: "OCCUPIED" },
    "Section D": { id: "Section D", code: "D", label: "Pallet D", x: 380, y: 320, section: "D", package: null, status: "EMPTY" },
    "Counter": { id: "Counter", code: "CTR", label: "Counter Pallet", x: 250, y: 440, section: "COUNTER", package: null, status: "EMPTY" },
    "CH01": { id: "CH01", code: "CH01", label: "Charging Dock", x: 380, y: 540, section: "CH", type: "CHARGING_STATION" },
    "HOME": { id: "HOME", code: "HOME", label: "Home Base", x: 120, y: 540, section: "HOME", type: "HOME_BASE" }
  },
  pallets: {
    "A": {
      section: "A",
      name: "Pallet A (Section A)",
      occupied: true,
      packageId: "PKG_A001",
      rfidTagId: "RF-A-984",
      scannerId: "RC522-SEC-A",
      lastScanned: new Date().toISOString(),
      status: "OCCUPIED"
    },
    "B": {
      section: "B",
      name: "Pallet B (Section B)",
      occupied: false,
      packageId: null,
      rfidTagId: "RF-B-442",
      scannerId: "RC522-SEC-B",
      lastScanned: new Date().toISOString(),
      status: "EMPTY"
    },
    "C": {
      section: "C",
      name: "Pallet C (Section C)",
      occupied: true,
      packageId: "PKG_C001",
      rfidTagId: "RF-C-120",
      scannerId: "RC522-SEC-C",
      lastScanned: new Date().toISOString(),
      status: "OCCUPIED"
    },
    "D": {
      section: "D",
      name: "Pallet D (Section D)",
      occupied: false,
      packageId: null,
      rfidTagId: "RF-D-773",
      scannerId: "RC522-SEC-D",
      lastScanned: new Date().toISOString(),
      status: "EMPTY"
    },
    "COUNTER": {
      section: "COUNTER",
      name: "Counter Pallet (Bay CTR)",
      occupied: false,
      packageId: null,
      rfidTagId: "RF-CTR-501",
      scannerId: "RC522-COUNTER",
      lastScanned: new Date().toISOString(),
      status: "EMPTY"
    }
  },
  charging: {
    batteryLow: false,
    charging: false,
    dock: "CHARGE_01",
    availableSlots: 1,
    totalSlots: 1,
    dockedRobot: null
  },
  alerts: [
    {
      id: "ALT-01",
      time: "14:25",
      type: "Critical",
      message: "Obstacle Detected — HC-SR04 front range 18cm (Motor Cutoff)",
      robotId: "RBT-01",
      status: "Unread",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: "ALT-02",
      time: "13:50",
      type: "Critical",
      message: "Weight Warning: Package weight is more than 1 kg (Limit: 1.0 kg) — Lift aborted",
      robotId: "RBT-01",
      status: "Unread",
      createdAt: new Date(Date.now() - 60 * 60000).toISOString()
    },
    {
      id: "ALT-03",
      time: "12:30",
      type: "Info",
      message: "Task completed — PKG_A001 dropped at Counter Pallet",
      robotId: "RBT-01",
      status: "Read",
      createdAt: new Date(Date.now() - 140 * 60000).toISOString()
    },
    {
      id: "ALT-04",
      time: "11:15",
      type: "Warning",
      message: "RFID detected — Pallet A scanned by RC522-SEC-A",
      robotId: "RBT-01",
      status: "Read",
      createdAt: new Date(Date.now() - 215 * 60000).toISOString()
    },
    {
      id: "ALT-05",
      time: "10:05",
      type: "Info",
      message: "Robot initialized — RBT-01 ready for missions",
      robotId: "RBT-01",
      status: "Read",
      createdAt: new Date(Date.now() - 285 * 60000).toISOString()
    }
  ],
  settings: {
    general: {
      warehouseName: "RAW BOT Logistics Central",
      timezone: "Asia/Kolkata (GMT+5:30)",
      language: "English",
      autoLogoutMinutes: 30
    },
    robot: {
      maxSpeed: 1.2, // m/s
      maxPayload: 2.5, // kg
      navigationMode: "AUTO_DYNAMIC",
      obstacleThreshold: 35, // cm
      batteryLowThreshold: 25 // %
    },
    notifications: {
      emailAlerts: true,
      browserAlerts: true,
      criticalSound: true,
      lowBatteryNotify: true
    },
    system: {
      simulationMode: true,
      simulationSpeed: 1.0,
      hardwareBridgeEnabled: false,
      esp32Ip: "192.168.1.150"
    }
  },
  users: [
    {
      id: "USR-001",
      name: "Amol Sawant",
      email: "admin@rawbot.io",
      role: "ADMIN",
      title: "System Administrator",
      status: "Active",
      lastLogin: new Date().toISOString()
    },
    {
      id: "USR-002",
      name: "Operations Manager",
      email: "manager@rawbot.io",
      role: "MANAGER",
      title: "Operations Manager / Reports & Monitoring",
      status: "Active",
      lastLogin: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: "USR-003",
      name: "Robot Operator Staff",
      email: "staff@rawbot.io",
      role: "STAFF",
      title: "Warehouse Staff / Robot Operator",
      status: "Active",
      lastLogin: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  auditLogs: [
    {
      id: "LOG-1001",
      user: "admin@rawbot.io",
      name: "Amol Sawant",
      role: "ADMIN",
      action: "LOGIN",
      timestamp: new Date().toISOString(),
      result: "SUCCESS"
    },
    {
      id: "LOG-1002",
      user: "manager@rawbot.io",
      name: "Operations Manager",
      role: "MANAGER",
      action: "LOGIN",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      result: "SUCCESS"
    },
    {
      id: "LOG-1003",
      user: "staff@rawbot.io",
      name: "Robot Operator Staff",
      role: "STAFF",
      action: "LOGIN",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      result: "SUCCESS"
    }
  ]
};

// In-Memory Database store with Event Emitter pattern for local realtime sync
class InMemoryRealtimeDB {
  constructor(initialData) {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.listeners = new Map();
  }

  // Get deep path
  _resolvePath(path) {
    const cleanPath = path.replace(/^\/|\/$/g, '');
    if (!cleanPath) return { parent: null, key: null, value: this.data };
    const parts = cleanPath.split('/');
    let current = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    const key = parts[parts.length - 1];
    return { parent: current, key, value: current[key] };
  }

  get(path) {
    const { value } = this._resolvePath(path);
    return JSON.parse(JSON.stringify(value !== undefined ? value : null));
  }

  set(path, value) {
    const { parent, key } = this._resolvePath(path);
    if (parent && key) {
      parent[key] = JSON.parse(JSON.stringify(value));
      this._emitChange(path, parent[key]);
    } else if (!parent && !key) {
      this.data = JSON.parse(JSON.stringify(value));
      this._emitChange('/', this.data);
    }
    return Promise.resolve();
  }

  update(path, updates) {
    const { value } = this._resolvePath(path);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(value, JSON.parse(JSON.stringify(updates)));
      this._emitChange(path, value);
    } else {
      this.set(path, updates);
    }
    return Promise.resolve();
  }

  push(path, item) {
    const { value } = this._resolvePath(path);
    const id = 'ID_' + Math.random().toString(36).substr(2, 9);
    const itemWithId = { id, ...item };
    if (Array.isArray(value)) {
      value.push(itemWithId);
      this._emitChange(path, value);
    } else if (value && typeof value === 'object') {
      value[id] = itemWithId;
      this._emitChange(path, value);
    }
    return Promise.resolve({ key: id, val: () => itemWithId });
  }

  on(path, eventType, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, []);
    }
    this.listeners.get(path).push(callback);
    // Send immediate initial value
    callback({ val: () => this.get(path) });
  }

  off(path, callback) {
    if (!this.listeners.has(path)) return;
    if (!callback) {
      this.listeners.delete(path);
    } else {
      const callbacks = this.listeners.get(path);
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    }
  }

  _emitChange(path, val) {
    // Notify exact matches and parent path subscribers
    this.listeners.forEach((callbacks, listenPath) => {
      if (path.startsWith(listenPath) || listenPath.startsWith(path) || listenPath === '/') {
        callbacks.forEach(cb => {
          try {
            cb({ val: () => this.get(listenPath) });
          } catch (e) {
            console.error('Listener callback error:', e);
          }
        });
      }
    });
  }
}

// Attempt Firebase Admin SDK init or fallback
function initFirebase() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  if (projectId && clientEmail && privateKey) {
    try {
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        }),
        databaseURL
      });
      dbInstance = admin.database();
      isRealFirebase = true;
      console.log('✅ Firebase Admin SDK connected successfully to:', databaseURL);
      return { db: dbInstance, isReal: true, admin };
    } catch (err) {
      console.warn('⚠️ Firebase Admin init failed with provided credentials. Falling back to local Realtime store:', err.message);
    }
  }

  console.log('⚡ Initializing RAW BOT Industrial Local Realtime DB & Simulator Store (Standalone / Zero-Config Mode)');
  dbInstance = new InMemoryRealtimeDB(initialDatabaseState);
  isRealFirebase = false;
  return { db: dbInstance, isReal: false, admin: null };
}

const firebaseConnection = initFirebase();

module.exports = {
  ...firebaseConnection,
  initialDatabaseState
};
