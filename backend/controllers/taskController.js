const firebaseService = require('../services/firebaseService');
const robotService = require('../services/robotService');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await firebaseService.getData('tasks');
    let list = Object.values(tasks || {});
    const { status, robot } = req.query;

    if (status && status !== 'All') {
      list = list.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }
    if (robot) {
      list = list.filter(t => t.robot === robot);
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await firebaseService.getData(`tasks/${req.params.id}`);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { packageNo, from, to, robot, priority } = req.body;
    if (!packageNo || !from || !to) {
      return res.status(400).json({ success: false, message: 'packageNo, from, and to are required' });
    }

    const taskId = `T-${Date.now().toString().slice(-3)}`;
    const assignedRobot = robot || 'RBT-01';

    const newTask = {
      id: taskId,
      packageNo,
      from,
      to,
      status: 'In Progress',
      robot: assignedRobot,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eta: '12 mins',
      priority: priority || 'HIGH',
      progress: 10,
      step: 'Assigned to robot'
    };

    await firebaseService.updateData(`tasks/${taskId}`, newTask);

    // If robot is assigned, command the robot to execute
    if (assignedRobot) {
      await robotService.executeCommand(assignedRobot, 'START', {
        destination: to,
        currentTask: `Transport ${packageNo} (${from} → ${to})`,
        taskId,
        packageId: packageNo
      });
      // Mark package in transit
      await firebaseService.updateData(`packages/${packageNo}`, {
        status: 'IN_TRANSIT',
        assignedRobot
      });
    }

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const existing = await firebaseService.getData(`tasks/${req.params.id}`);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updated = { ...existing, ...req.body };
    await firebaseService.updateData(`tasks/${req.params.id}`, updated);

    // If completed, update package and free robot
    if (req.body.status === 'Completed') {
      if (existing.packageNo) {
        await firebaseService.updateData(`packages/${existing.packageNo}`, {
          location: existing.to,
          status: 'AVAILABLE',
          assignedRobot: null
        });
      }
      if (existing.robot) {
        await firebaseService.updateData(`robots/${existing.robot}`, {
          status: 'Idle',
          currentTask: 'Waiting for task',
          taskId: null,
          packageId: null,
          speed: 0.0
        });
      }
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await firebaseService.removeData(`tasks/${req.params.id}`);
    res.json({ success: true, message: `Task ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
