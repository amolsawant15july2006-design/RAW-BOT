const { db, isReal } = require('../config/firebase');

const firebaseService = {
  isRealFirebase: () => isReal,

  async getData(path) {
    if (isReal) {
      const snapshot = await db.ref(path).once('value');
      return snapshot.val();
    } else {
      return db.get(path);
    }
  },

  async setData(path, value) {
    if (isReal) {
      await db.ref(path).set(value);
    } else {
      await db.set(path, value);
    }
    return value;
  },

  async updateData(path, updates) {
    if (isReal) {
      await db.ref(path).update(updates);
    } else {
      await db.update(path, updates);
    }
    return updates;
  },

  async pushData(path, item) {
    if (isReal) {
      const ref = await db.ref(path).push(item);
      return { id: ref.key, ...item };
    } else {
      return await db.push(path, item);
    }
  },

  async removeData(path) {
    if (isReal) {
      await db.ref(path).remove();
    } else {
      await db.set(path, null);
    }
    return true;
  },

  subscribe(path, callback) {
    if (isReal) {
      const ref = db.ref(path);
      const listener = ref.on('value', (snap) => callback(snap.val()));
      return () => ref.off('value', listener);
    } else {
      const cb = (snap) => callback(snap.val());
      db.on(path, 'value', cb);
      return () => db.off(path, cb);
    }
  }
};

module.exports = firebaseService;
