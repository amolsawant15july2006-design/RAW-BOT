const firebaseService = require('./firebaseService');

const VALID_COMMANDS = ['START', 'STOP', 'PAUSE', 'RESUME', 'EMERGENCY_STOP', 'CHARGE'];

const robotService = {
  async getAllRobots() {
    const robots = await firebaseService.getData('robots');
    return Object.values(robots || {});
  },

  async getRobotById(id) {
    const robots = await firebaseService.getData('robots');
    return robots ? robots[id] : null;
  },

  async executeCommand(robotId, command, extraParams = {}) {
    if (!VALID_COMMANDS.includes(command)) {
      throw new Error(`Invalid robot command: ${command}. Valid commands: ${VALID_COMMANDS.join(', ')}`);
    }

    const robot = await this.getRobotById(robotId);
    if (!robot) {
      throw new Error(`Robot with ID ${robotId} not found`);
    }

    const updates = {
      lastUpdate: new Date().toISOString()
    };

    let statusUpdate = robot.status;
    let liftUpdate = robot.lift;
    let speedUpdate = robot.speed;

    switch (command) {
      case 'START':
        statusUpdate = 'Working';
        speedUpdate = 0.8;
        break;
      case 'STOP':
        statusUpdate = 'Idle';
        speedUpdate = 0.0;
        break;
      case 'PAUSE':
        statusUpdate = 'Paused';
        speedUpdate = 0.0;
        break;
      case 'RESUME':
        statusUpdate = 'Working';
        speedUpdate = 0.8;
        break;
      case 'EMERGENCY_STOP':
        statusUpdate = 'Emergency Stop';
        speedUpdate = 0.0;
        // Trigger Critical Alert
        await firebaseService.pushData('alerts', {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Critical',
          message: `Emergency Stop Activated for ${robotId}`,
          robotId: robotId,
          status: 'Unread',
          createdAt: new Date().toISOString()
        });
        // Update root alert object matching Section #25
        await firebaseService.updateData('alerts_status', {
          emergency: true,
          message: `Emergency Stop on ${robotId}`
        });
        break;
      case 'CHARGE':
        statusUpdate = 'Moving to Charger';
        updates.destination = 'CH01';
        updates.currentTask = 'Returning to Charging Station';
        speedUpdate = 0.5;
        break;
    }

    updates.status = statusUpdate;
    updates.lift = liftUpdate;
    updates.speed = speedUpdate;

    if (extraParams.destination) updates.destination = extraParams.destination;
    if (extraParams.currentTask) updates.currentTask = extraParams.currentTask;
    if (extraParams.taskId) updates.taskId = extraParams.taskId;
    if (extraParams.packageId) updates.packageId = extraParams.packageId;

    // Update in fleet
    await firebaseService.updateData(`robots/${robotId}`, updates);

    // If RBT-01 or active robot, also sync to primary single-robot node matching Section #25 for ESP32
    if (robotId === 'RBT-01') {
      await firebaseService.updateData('robot', {
        command,
        status: statusUpdate.toUpperCase(),
        battery: robot.battery,
        weight: robot.weight || 0.72,
        currentLocation: updates.currentLocation || robot.currentLocation,
        destination: updates.destination || robot.destination,
        lift: updates.lift || robot.lift,
        error: command === 'EMERGENCY_STOP' ? 'EMERGENCY_STOP' : ''
      });
    }

    return { ...robot, ...updates, command };
  },

  async updateRobot(robotId, data) {
    const existing = await this.getRobotById(robotId);
    if (!existing) {
      throw new Error(`Robot ${robotId} not found`);
    }
    const updated = {
      ...existing,
      ...data,
      lastUpdate: new Date().toISOString()
    };
    await firebaseService.updateData(`robots/${robotId}`, updated);
    return updated;
  },

  async addRobot(robotData) {
    const id = robotData.id || `RBT-0${Date.now().toString().slice(-2)}`;
    const newRobot = {
      id,
      name: robotData.name || `Robot ${id}`,
      status: robotData.status || 'Idle',
      battery: robotData.battery || 100,
      currentLocation: robotData.currentLocation || 'HOME',
      destination: robotData.destination || 'HOME',
      currentTask: 'Idle',
      taskId: null,
      packageId: null,
      lift: 'DOWN',
      weight: 0.0,
      speed: 0.0,
      mode: 'AUTO',
      lastUpdate: new Date().toISOString(),
      sensors: {
        ultrasonic: 150,
        irLeft: false,
        irRight: false,
        rfid: 'NONE',
        qrCamera: 'NONE',
        encoderLeft: 0,
        encoderRight: 0,
        linearActuator: 'RETRACTED'
      }
    };
    await firebaseService.updateData(`robots/${id}`, newRobot);
    return newRobot;
  }
};

module.exports = robotService;
