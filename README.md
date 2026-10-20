# RAW BOT — Robotic Autonomous Warehouse Bot
### Autonomous Mobile Robot (AMR) Warehouse Fleet Management System
**Final Year Project • Department of Computer Engineering**

---

## 1. Project Overview & System Architecture

**RAW BOT** (Robotic Autonomous Warehouse Bot) is an industrial-grade warehouse management, fleet telemetry, and mission command website designed for autonomous mobile robots (AMRs). The system connects:
- **Frontend UI**: React.js 19 + Tailwind CSS + Lucide Icons + Three.js 3D Digital Twin
- **Backend API**: Node.js + Express.js + RESTful APIs + JWT Role Middleware + In-Memory Realtime Simulator
- **Database & Cloud**: Firebase Realtime Database & Cloud Firestore + Firebase Authentication
- **Embedded Robot Controllers**: ESP32 Master (Mecanum drive, IR line-following, HC-SR04 ultrasonic, RC522 RFID) + ESP32 Slave (Scissor lift actuator, HX711 load cell, ESP32-CAM QR reader, INA219 battery monitor)
- **Live Google Cloud Hosting**: Firebase Hosting (Frontend SPA) + Google Cloud Run (Backend API)

```
┌────────────────────────────────────────────────────────────────────────┐
│                   RAW BOT INDUSTRIAL CONTROL CENTER                    │
│           React 19 + Tailwind CSS + Lucide React + Three.js 3D         │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTPS / REST / WSS
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      NODE.JS + EXPRESS BACKEND API                     │
│         Role Authentication (Admin / Manager / Staff) + JWT            │
│       Mission Validation + Command Dispatch + Audit Log Engine         │
└──────────────────┬───────────────────────────────────┬─────────────────┘
                   │                                   │
                   ▼                                   ▼
┌──────────────────────────────────┐ ┌───────────────────────────────────┐
│     FIREBASE CLOUD REALTIME DB   │ │   AUTONOMOUS REALTIME SIMULATOR   │
│   Robots, Tasks, Pallets, Alerts │ │    (Local Academic Standalone)    │
└──────────────────┬───────────────┘ └─────────────────┬─────────────────┘
                   │                                   │
                   ▼ Wi-Fi / REST                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   PHYSICAL AMR ROBOT CONTROLLERS                       │
│  ESP32 MASTER: 4 Mecanum Wheels, IR Line Grid, Ultrasonic, RC522 RFID  │
│  ESP32 SLAVE:  Motorized Scissor Lift, HX711 Load Cell, ESP32-CAM QR   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Language Selection

| Technology | Purpose | Role in RAW BOT |
| :--- | :--- | :--- |
| **HTML5 & CSS3** | Web standards structure & base styling | Semantic layout and container structure |
| **JavaScript (ES6+)** | Application logic & async operations | Event handling, state management, promises |
| **React.js 19** | Modern reactive component framework | Fast virtual DOM rendering, hooks, page routing |
| **Tailwind CSS** | Industrial design system & dark theme | High-contrast dark charcoal (`#05070A`), neon cyans and greens |
| **DOM** | Browser Document Object Model | React efficiently manages virtual DOM diffing |
| **Node.js** | Backend JavaScript runtime | Asynchronous non-blocking server environment |
| **Express.js** | RESTful routing & middleware engine | API endpoints for tasks, robots, telemetry, and audit logs |
| **Firebase Auth & RTDB** | Realtime cloud database & identity | Instant 2-way data binding between robot and web UI |
| **Three.js** | WebGL 3D interactive computer graphics | Digital twin of AMR and 3D spatial warehouse facility |
| **Firebase Hosting** | Global edge-cached CDN | Static site hosting for React SPA frontend |
| **Google Cloud Run** | Serverless containerized compute | Scalable production hosting for Express backend |

> **Why Firebase instead of MongoDB initially?**
> Firebase provides instant push listeners (`onValue()`) without configuring custom WebSocket infrastructure. This allows AMR telemetry (battery %, location, obstacle status) to update on the website instantaneously. If persistent relational analytics or complex aggregation pipelines are needed later, MongoDB can be attached as a secondary data store.

---

## 3. Three-Tier Role-Based Security

Every user logs in with their individual email and password. Permissions are strictly enforced both client-side and server-side:

| Feature / Page | Admin (`admin@rawbot.io`) | Manager (`manager@rawbot.io`) | Staff (`staff@rawbot.io`) |
| :--- | :---: | :---: | :---: |
| **1. Dashboard** | Full Access | View Only | Operational View |
| **2. Robots** | Full Control (Add / Provision) | View & Monitor | View & Select Unit |
| **3. Tasks** | Full Control | Monitor Progress | Create, Dispatch, Cancel |
| **4. Pallets** | Full Access | View Inventory | View Pallet Bays |
| **5. Warehouse** | Full Access | View 3D Racks | View Racks |
| **6. Navigation** | Full Access | Monitor Routes | Plan Route, Start, E-STOP |
| **7. Reports** | All Reports + Export | All Reports + Export | View Operational History |
| **8. Alerts** | Full Access + Settings | View & Monitor | View & Acknowledge |
| **9. Settings** | Full Access | View Only | View Personal |
| **10. Admin Panel** | Full Access (Audit / Users) | Access Restricted | Access Restricted |

### Verified Default Credentials
- **Admin**: `admin@rawbot.io` • Password: `password123`
- **Manager**: `manager@rawbot.io` • Password: `password123`
- **Staff**: `staff@rawbot.io` • Password: `password123`

---

## 4. Complete Application Structure

### Public Pages (Accessible Before Login)
1. **Home (`/home` & `/`)**: High-tech landing page with hero banner, autonomous AMR highlights, role security overview, and system metrics.
2. **About (`/about`)**: Detailed engineering whitepaper explaining Mecanum kinematics, ESP32 Master/Slave architecture, sensor integration, and cloud pipeline.
3. **Contact (`/contact`)**: Dispatch desk support form, operations hotline, emergency safety protocol, and facility contact details.
4. **Login (`/login`)**: Secure portal with 3 role cards, individual email/password inputs, show/hide password toggle, forgot password helper, and 1-click evaluation shortcuts.

---

### The 10 Main Operational Dashboard Pages

#### Page 1: Dashboard (`/dashboard`)
- **Summary KPI Cards**: Total Robots, Available Units, Working Units, Total Packages, Active Tasks, Completed Tasks Today, Pending Tasks, Active Alerts.
- **Interactive 3D Robot Digital Twin**: Real-time rotating Mecanum AMR with motorized lift state and status ring.
- **Robot Status Overview**: Telemetry metrics (Battery %, payload weight, operating mode, transit speed).
- **Recent Activities & Alert Feeds**: Live timeline of warehouse events and sensor alerts.

#### Page 2: Robots (`/robots`)
- **Robot Search Bar**: Real-time filter to search AMR by Robot ID (e.g. `RBT-01`), name, or bay location.
- **Fleet Table**: ID, Name, Operating Status (Working, Idle, Charging, Emergency Stop), Battery gauge, Location, and Current Task.
- **Detailed Robot Modal**: Clicking any robot opens complete telemetry:
  - Battery percentage & voltage telemetry
  - Current task being executed
  - Ultrasonic front range (HC-SR04)
  - IR line-sensor tracking state
  - RFID tag & ESP32-CAM QR verification status
  - Remote command controls: Start/Resume, Pause, Dock to Charge, Emergency Stop.
- **Add New Robot**: Provisioning modal restricted to Admin (Boss) accounts.

#### Page 3: Tasks (`/tasks`)
- **Section Filters**: View tasks by Section A, Section B, Section C, or Section D.
- **Status Filter Tabs**: All Tasks, Active (In Progress), Pending, and Completed.
- **Mission Execution Table**: Task ID, Package No, Source Section, Destination Section, Status badge, Assigned Robot, Created Time, and Completed Time.
- **10-Step Autonomous Mission Workflow Pipeline**:
  `01. Select Package` → `02. Find Package` → `03. Assign Robot` → `04. Navigate to Source` → `05. Identify Package` → `06. Pick Up Package` → `07. Transport Package` → `08. Drop Package` → `09. Verify Delivery` → `10. Complete Task`.
- **Create Task Modal**: Schedule autonomous transport from source section to target section.

#### Page 4: Pallets (`/pallets`)
- **4 Dedicated Warehouse Bays**: Section A, Section B, Section C, and Section D.
- **Single-Package Constraint**: Exactly one package slot per section.
  - **Section A**: Occupied with Package (`PKG_A001`), Unique RFID: `RF-A01-984`, ESP32-CAM QR code.
  - **Section B**: Empty bay available for incoming cargo (`RF-B01-442`).
  - **Section C**: Occupied with Package (`PKG_C001`), Unique RFID: `RF-C01-120`, ESP32-CAM QR code.
  - **Section D**: Empty bay available for incoming cargo (`RF-D01-773`).
- **RFID Station Scanner Telemetry**: Reader ID, unique RFID tag ID, last scanned timestamp, and verification state.
- **Interactive Scan Trigger**: "Scan Section" button to simulate physical RC522 RFID reader events.

#### Page 5: Warehouse (`/warehouse`)
- **Interactive 3D Digital Twin**: Built with Three.js rendering storage racks, pallets, floor path lanes, and the wireless charging dock.
- **Section Selection Buttons**: Interactive inspection for Section A, Section B, Section C, and Section D.
- **Live Inventory Breakdown**: Detailed pallet carton specifications, weight, and occupancy status.

#### Page 6: Map & Navigation (`/navigation`)
- **2D / 3D Coordinate Navigation Grid**: Displays real-time AMR movement along warehouse route waypoints.
- **Task Route Planning Form**:
  - Package selection with QR code mapping
  - Source section selection (A, B, C, D, or HOME)
  - Target destination section selection (A, B, C, D, or CH01 Charger)
  - AMR robot unit assignment
  - Start Task dispatch button
- **Actuation Controls**: Real-time Start, Pause, Resume, and Emergency Stop (E-STOP).

#### Page 7: Reports (`/reports`)
- **Daily Performance Metrics**: Total missions scheduled, completion rate, average transit duration, and AMR utilization %.
- **Interactive Analytics Charts**:
  - Daily mission trend bars (Completed vs Pending)
  - Fleet duty-cycle donut chart (Working, Charging, Idle, Offline)
  - Battery discharge and charging curve across time
- **Data Export Options**:
  - **Export to CSV**: Instant spreadsheet download of all mission records
  - **Export to PDF**: Formatted executive report generated via `jspdf`
  - Print daily report summary

#### Page 8: Alerts (`/alerts`)
- **Live Incident Stream**: Categorized with severity badges (`Critical`, `Warning`, `Info`).
- **7 Automated Sensor Fault Presets**:
  1. `Obstacle Detected`: Ultrasonic sensor detects object within 18cm (halts motors immediately).
  2. `Out of Line / Off Route`: IR optical line-tracking sensors lose lane guidance.
  3. `Weight Alert / Overload`: HX711 load cell detects payload exceeding 2.5kg threshold.
  4. `Low Battery Alert`: INA219 sensor reads voltage under 20% (triggers auto-docking).
  5. `Task Completed Alert`: Robot verifies drop and delivery at destination section.
  6. `RFID Not Detected Alert`: RC522 reader fails to acquire pallet RFID tag.
  7. `QR Code Not Identified Alert`: ESP32-CAM camera frame mismatch at pickup stand.
- **Acknowledge Alert & Clear**: Operators can acknowledge incidents or clear the active safety stream.

#### Page 9: Settings (`/settings`)
- **General Settings**: Warehouse facility name, timezone, default language, and session timeout.
- **Robot Configuration**: Max speed (m/s), max payload limit (kg), obstacle cutoff distance (cm), and battery threshold.
- **Network Settings**: Controller IP (`192.168.1.150`), polling frequency, Wi-Fi RSSI signal strength, and Firebase connectivity.
- **Notification Settings**: Audio alerts, critical popups, and email notifications.
- **Backup & Restore**: Export system database JSON and restore verified configurations.

#### Page 10: Admin Panel (`/admin`)
- **Authentication Audit Trail**: Complete log recording **who logged in or logged out**, with exact timestamp, date, user email, role, and success status.
- **Account Switcher**: Instant switch between Admin, Manager, and Staff accounts with session updates.
- **User Role Management**: Create new user accounts, assign roles (Admin, Manager, Staff), enable/disable accounts, and delete records.
- **Secure Terminal Logout**: Clears session token and writes a logout entry to the audit trail.
- **Firebase Realtime Schema Explorer**: Live raw JSON tree inspector showing root database nodes (`/robot`, `/robots`, `/packages`, `/pallets`, `/tasks`, `/alerts`).

---

## 5. Local Setup & Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)
- Git

### One-Command Setup & Launch (Root Directory)
```bash
# Clone the repository
git clone https://github.com/amolsawant15july2006-design/RAW-BOT.git
cd RAW-BOT

# Install all dependencies (root, backend, and frontend)
npm run install:all

# Launch both backend (port 5000) and frontend (port 5173) concurrently
npm run dev
```

The system will start:
- **Frontend URL**: `http://localhost:5173`
- **Backend Health API**: `http://localhost:5000/api/health`

---

## 6. How to Host Live on Google

You can deploy the complete project live on Google's cloud infrastructure:
1. **Frontend**: Firebase Hosting (Google Global CDN)
2. **Backend**: Google Cloud Run (Containerized Node.js Microservice)

### Step 1: Deploying the Frontend to Firebase Hosting
```bash
# 1. Install Firebase CLI globally
npm install -g firebase-tools

# 2. Authenticate with your Google account
firebase login

# 3. Build the production React frontend
cd frontend
npm run build
cd ..

# 4. Initialize Firebase Hosting (select your Firebase Project)
firebase init hosting
# - What do you want to use as your public directory? -> frontend/dist
# - Configure as a single-page app (rewrite all urls to /index.html)? -> Yes
# - Set up automatic builds and deploys with GitHub? -> Optional

# 5. Deploy to live Google CDN
firebase deploy --only hosting
```
Firebase will output your live URL:
```text
✔ Deploy complete!
Hosting URL: https://raw-bot-warehouse.web.app
```

### Step 2: Deploying the Backend to Google Cloud Run
```bash
# 1. Install Google Cloud SDK (gcloud CLI) from https://cloud.google.com/sdk
# 2. Login and set project
gcloud auth login
gcloud config set project your-google-cloud-project-id

# 3. Deploy the backend folder to Cloud Run
cd backend
gcloud run deploy raw-bot-api \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=8080

# Cloud Run will output your live API endpoint:
# https://raw-bot-api-xyz-uc.a.run.app
```

### Step 3: Connect Frontend to Deployed Backend
Update `frontend/.env` with your deployed Cloud Run URL:
```env
VITE_API_BASE_URL=https://raw-bot-api-xyz-uc.a.run.app/api
```
Re-run `npm run build` in `frontend` and `firebase deploy --only hosting`. Your website is now 100% live on Google!

---

## 7. ESP32 Master & Slave Hardware Integration

### Communication Protocol
The physical AMR uses two microcontrollers communicating via I2C / Serial:
1. **ESP32 Master**: Handles Wi-Fi connection, Firebase / REST API polling, Mecanum wheel motor drivers, 3-channel TCRT5000 IR line sensor, HC-SR04 ultrasonic sensor, and RC522 RFID reader.
2. **ESP32 Slave**: Controls the motorized scissor lift linear actuator, reads the HX711 load cell weight, streams QR images from the ESP32-CAM, and monitors battery voltage via INA219.

### Ready-to-Flash Arduino Firmware
The complete Arduino C++ firmware template is provided in:
`backend/esp32/esp32_firmware_sample.ino`

Flash this sketch to your ESP32 Master using the Arduino IDE with `ESP32 Board Package v2.0+` installed.

---

## 8. Automated Verification & Testing

To run automated end-to-end tests against all backend API endpoints:
```bash
cd backend
node test_all_endpoints.js
```

All 10 test suites will verify:
- Health diagnostics
- Fleet telemetry queries
- Mission command dispatching
- Pallet inventory & RFID mappings
- Incident alert streaming
- System calibration retrieval
- Admin JWT authorization & login audit logging
- Autonomous simulation engine status

---

## 9. Contributors & Academic Attribution

**RAW BOT Engineering Team**
- Department of Computer Engineering
- Bachelor of Engineering Final Year Project
- Project Lead: Amol Sawant
