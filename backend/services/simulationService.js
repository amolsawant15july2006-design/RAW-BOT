const firebaseService = require('./firebaseService');

class SimulationEngine {
  constructor() {
    this.isRunning = true;
    this.speed = 1.0;
    this.timer = null;
    this.intervalMs = 3000; // 3 seconds per simulation tick
    this.pathWaypoints = {
      'T-001': ['Section A', 'Section B'],
      'T-002': ['Section C', 'Section D']
    };
    this.stepIndex = 0;
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    this.isRunning = true;
    this.timer = setInterval(() => this.tick(), this.intervalMs / this.speed);
    console.log(`🤖 Autonomous Simulation Engine Started (Speed: ${this.speed}x)`);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
    console.log('⏸️ Autonomous Simulation Engine Paused');
  }

  setSpeed(multiplier) {
    this.speed = Math.max(0.5, Math.min(10.0, multiplier));
    if (this.isRunning) {
      this.start();
    }
  }

  async tick() {
    try {
      const robots = await firebaseService.getData('robots');
      if (!robots) return;

      // 1. Simulate RBT-01 autonomous movement along active mission if working
      const rbt01 = robots['RBT-01'];
      if (rbt01 && (rbt01.status === 'Working' || rbt01.status === 'Moving')) {
        const waypoints = ['Section A', 'Counter', 'Section B', 'Section C', 'Section D', 'HOME'];
        this.stepIndex = (this.stepIndex + 1) % waypoints.length;
        const nextLoc = waypoints[this.stepIndex];
        const nextDest = waypoints[(this.stepIndex + 1) % waypoints.length];

        const newBattery = Math.max(15, (rbt01.battery || 85) - 0.2);
        const updates = {
          currentLocation: nextLoc,
          destination: nextDest,
          battery: Math.round(newBattery * 10) / 10,
          speed: 0.8,
          lastUpdate: new Date().toISOString()
        };

        // Linear lift toggle depending on location
        if (nextLoc === 'Counter' || nextLoc === 'Section B') {
          updates.lift = 'DOWN';
          updates.weight = 0.0;
          updates.currentTask = nextLoc === 'Counter' ? 'Deliver to Counter' : 'Drop Package at Pallet B';
        } else if (nextLoc === 'Section A') {
          // Weight measured by load cell AFTER lifting empty box
          const measuredWeight = 0.20; // Empty box weight (under 1.0 kg)
          if (measuredWeight <= 1.0) {
            updates.lift = 'UP';
            updates.weight = measuredWeight;
            updates.currentTask = `Lifted Empty Box (${measuredWeight} kg — OK)`;
          } else {
            // Safety interlock: if package weight is more than 1 kg, abort lift and trigger dashboard alert
            updates.lift = 'DOWN';
            updates.weight = measuredWeight;
            updates.status = 'Idle';
            await this.triggerOverweight('RBT-01', measuredWeight);
          }
        }

        await firebaseService.updateData('robots/RBT-01', updates);

        // Also update primary single robot node
        await firebaseService.updateData('robot', {
          currentLocation: nextLoc,
          destination: nextDest,
          battery: updates.battery,
          status: 'MOVING',
          lift: updates.lift,
          weight: updates.weight
        });
      }
    } catch (err) {
      console.error('Simulation tick error:', err.message);
    }
  }

  async triggerObstacle(robotId = 'RBT-01') {
    await firebaseService.updateData(`robots/${robotId}`, {
      status: 'Warning',
      speed: 0.0
    });
    await firebaseService.pushData('alerts', {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Warning',
      message: `Obstacle Detected near ${robotId} sensor array (Distance: 18cm)`,
      robotId,
      status: 'Unread',
      createdAt: new Date().toISOString()
    });
    return { success: true, message: `Obstacle simulated for ${robotId}` };
  }

  async triggerOverweight(robotId = 'RBT-01', weight = 1.45) {
    await firebaseService.updateData(`robots/${robotId}`, {
      status: 'Warning',
      speed: 0.0,
      lift: 'DOWN',
      weight
    });
    await firebaseService.pushData('alerts', {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Critical',
      message: `Weight Warning: Package weight is more than 1 kg (Detected: ${weight} kg) — Lift aborted`,
      robotId,
      status: 'Unread',
      createdAt: new Date().toISOString()
    });
    return { success: true, message: `Overweight alert simulated for ${robotId}` };
  }
}

const simulationEngine = new SimulationEngine();
simulationEngine.start();

module.exports = simulationEngine;
