const firebaseService = require('../services/firebaseService');

exports.getPackages = async (req, res) => {
  try {
    const packages = await firebaseService.getData('packages');
    const list = Object.values(packages || {});
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const pkg = await firebaseService.getData(`packages/${req.params.id}`);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const { id, section, location, qr, rfid, weight, status } = req.body;
    const pkgId = id || `PKG_${Date.now().toString().slice(-4)}`;
    const newPkg = {
      id: pkgId,
      section: section || 'A',
      location: location || 'A1',
      qr: qr || pkgId,
      rfid: rfid || `RF-${pkgId}`,
      weight: parseFloat(weight) || 1.0,
      status: status || 'AVAILABLE',
      assignedRobot: null,
      createdAt: new Date().toISOString()
    };
    await firebaseService.updateData(`packages/${pkgId}`, newPkg);
    res.status(201).json({ success: true, data: newPkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const existing = await firebaseService.getData(`packages/${req.params.id}`);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    const updated = { ...existing, ...req.body };
    await firebaseService.updateData(`packages/${req.params.id}`, updated);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    await firebaseService.removeData(`packages/${req.params.id}`);
    res.json({ success: true, message: `Package ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
