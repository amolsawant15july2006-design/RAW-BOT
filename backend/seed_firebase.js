const { initialDatabaseState } = require('./config/firebase');

const FIREBASE_URL = 'https://raw-bot-3caa5-default-rtdb.firebaseio.com/.json';

async function seedFirebase() {
  console.log('🔥 Connecting to Firebase Realtime Database:', FIREBASE_URL);
  
  try {
    const res = await fetch(FIREBASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initialDatabaseState)
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Firebase Realtime Database successfully seeded with full RAW-BOT initial state!');
      console.log('Nodes populated: robot, robots, packages, tasks, locations, pallets, alerts, settings, users');
    } else {
      console.error('❌ Failed to seed Firebase:', res.status, res.statusText);
    }
  } catch (error) {
    console.error('❌ Error seeding Firebase:', error.message);
  }
}

seedFirebase();
