const { db, isReal } = require('../config/firebase');

const CLOUD_DB_URL = process.env.FIREBASE_DATABASE_URL ? process.env.FIREBASE_DATABASE_URL.replace(/\/$/, '') : null;

// Background Cloud Sync to Firebase Realtime Database
async function syncToCloud(path, method, body = null) {
  if (!CLOUD_DB_URL) return;
  try {
    const cleanPath = path.replace(/^\/|\/$/g, '');
    const url = `${CLOUD_DB_URL}/${cleanPath}.json`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body !== null && method !== 'GET' && method !== 'DELETE') {
      options.body = JSON.stringify(body);
    }
    await fetch(url, options);
  } catch (err) {
    // Silently continue if offline
  }
}

const firebaseService = {
  isRealFirebase: () => isReal || Boolean(CLOUD_DB_URL),

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
    syncToCloud(path, 'PUT', value);
    return value;
  },

  async updateData(path, updates) {
    if (isReal) {
      await db.ref(path).update(updates);
    } else {
      await db.update(path, updates);
    }
    syncToCloud(path, 'PATCH', updates);
    return updates;
  },

  async pushData(path, item) {
    let result;
    if (isReal) {
      const ref = await db.ref(path).push(item);
      result = { id: ref.key, ...item };
    } else {
      result = await db.push(path, item);
    }
    syncToCloud(path, 'POST', item);
    return result;
  },

  async removeData(path) {
    if (isReal) {
      await db.ref(path).remove();
    } else {
      await db.set(path, null);
    }
    syncToCloud(path, 'DELETE', null);
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
