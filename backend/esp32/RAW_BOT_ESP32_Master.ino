#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_MCP23X17.h>

// ==============================================================================
// RAW BOT — INDUSTRIAL 4-MOTOR MECANUM + 4-ULTRASONIC AGV MASTER CONTROLLER
// ESP32 + MCP23017 (I2C) + TWO L298N DUAL H-BRIDGES + FOUR HC-SR04 SENSORS
// ==============================================================================

// --- WI-FI NETWORK MODE CONFIGURATION ---
// Option 1: Standalone AP Mode (ESP32 creates its own Wi-Fi: 192.168.4.1)
// Option 2: Station Mode (ESP32 connects to your Home Router or Phone Hotspot)
#define USE_WIFI_STATION false   // Change to true to connect to home/mobile Wi-Fi

#if USE_WIFI_STATION
  const char* ssid = "YOUR_WIFI_SSID";           // Replace with your router SSID
  const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your router password
#else
  const char* ssid = "RAW_BOT";
  const char* password = "RawBot1234";
#endif

WebServer server(80); 
Adafruit_MCP23X17 mcp;

// ---------------- I2C PINS ----------------
#define I2C_SDA 21
#define I2C_SCL 22
#define MCP_ADDRESS 0x20

// ---------------- ULTRASONIC SENSOR PINS ----------------
// Note: HC-SR04 Echo outputs 5V. Use 1k/2k resistor voltage divider to protect 3.3V GPIOs!
#define FRONT_TRIG 18
#define FRONT_ECHO 34

#define BACK_TRIG 14
#define BACK_ECHO 35

#define LEFT_TRIG 19
#define LEFT_ECHO 32

#define RIGHT_TRIG 23
#define RIGHT_ECHO 33

// ---------------- MCP23017 MOTOR OUTPUT PINS ----------------
// GPA0-GPA7 connected to IN1-IN4 of Motor Drivers
#define FL_IN1 0
#define FL_IN2 1

#define FR_IN1 2
#define FR_IN2 3

#define BL_IN1 4
#define BL_IN2 5

#define BR_IN1 6
#define BR_IN2 7

// ---------------- SETTINGS & TIMERS ----------------
const float STOP_DISTANCE = 20.0;             // Obstacle halt threshold in cm
const unsigned long SENSOR_INTERVAL = 100;    // Sensor refresh rate (ms)
const unsigned long MOVEMENT_TIMEOUT = 1500;  // Auto-stop if browser heartbeat lost (ms)

unsigned long lastSensorRead = 0;
unsigned long lastMovementRefresh = 0;

bool mcpReady = false;
bool emergencyStopped = false;
bool isMoving = false;

String activeDirection = "S";

float frontDistance = 999.0;
float backDistance = 999.0;
float leftDistance = 999.0;
float rightDistance = 999.0;

// Motor direction invert flags (toggle if a motor spins backwards)
bool invertFL = false;
bool invertFR = false;
bool invertBL = false;
bool invertBR = false;

// =====================================================
// CORS HELPER FOR BROWSER / WEBSITE ACCESS
// =====================================================
void sendCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

// =====================================================
// MOTOR CONTROL (MCP23017)
// =====================================================
void stopMotors() {
  if (mcpReady) {
    for (int pin = 0; pin < 8; pin++) {
      mcp.digitalWrite(pin, LOW);
    }
  }
  isMoving = false;
  activeDirection = "S";
}

void setMotor(int pin1, int pin2, int direction, bool inverted) {
  if (inverted) direction = -direction;

  mcp.digitalWrite(pin1, LOW);
  mcp.digitalWrite(pin2, LOW);

  if (direction > 0) {
    mcp.digitalWrite(pin1, HIGH);
  } else if (direction < 0) {
    mcp.digitalWrite(pin2, HIGH);
  }
}

void drive(int fl, int fr, int bl, int br) {
  if (!mcpReady || emergencyStopped) {
    stopMotors();
    return;
  }

  // Pre-clear all pins to eliminate inductive shoot-through
  stopMotors();

  setMotor(FL_IN1, FL_IN2, fl, invertFL);
  setMotor(FR_IN1, FR_IN2, fr, invertFR);
  setMotor(BL_IN1, BL_IN2, bl, invertBL);
  setMotor(BR_IN1, BR_IN2, br, invertBR);
}

// =====================================================
// FOUR ULTRASONIC SENSORS (FIXED LOGIC)
// =====================================================
float readDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // 12000 us timeout ≈ 205 cm range
  unsigned long duration = pulseIn(echoPin, HIGH, 12000);

  // FIX: In ultrasonic sensors, 0 duration means no obstacle within 2 meters (CLEAR!)
  // Returning 999.0 prevents the robot from getting falsely blocked in open space.
  if (duration == 0) return 999.0;

  return duration * 0.0343f / 2.0f;
}

void updateSensors() {
  if (millis() - lastSensorRead < SENSOR_INTERVAL) return;
  lastSensorRead = millis();

  frontDistance = readDistance(FRONT_TRIG, FRONT_ECHO);
  delayMicroseconds(300);

  backDistance = readDistance(BACK_TRIG, BACK_ECHO);
  delayMicroseconds(300);

  leftDistance = readDistance(LEFT_TRIG, LEFT_ECHO);
  delayMicroseconds(300);

  rightDistance = readDistance(RIGHT_TRIG, RIGHT_ECHO);
}

// Fixed Obstacle check: True ONLY if distance is valid and <= 20cm
bool sensorBlocked(float distance) {
  return (distance > 0 && distance <= STOP_DISTANCE);
}

// Direction-specific obstacle checks
bool directionBlocked(String dir) {
  if (dir == "F") return sensorBlocked(frontDistance);
  if (dir == "B") return sensorBlocked(backDistance);
  if (dir == "L") return sensorBlocked(leftDistance);
  if (dir == "R") return sensorBlocked(rightDistance);

  // Rotation checks both sides for sweep obstacles
  if (dir == "A" || dir == "C") {
    return sensorBlocked(leftDistance) || sensorBlocked(rightDistance);
  }

  return false;
}

// =====================================================
// MOVEMENT EXECUTION
// =====================================================
bool executeMovement(String dir) {
  if (!mcpReady || emergencyStopped) {
    stopMotors();
    return false;
  }

  updateSensors();

  if (directionBlocked(dir)) {
    stopMotors();
    Serial.print("[SAFETY HALT] Obstacle detected in direction: ");
    Serial.println(dir);
    return false;
  }

  if (dir == "F") {
    drive(1, 1, 1, 1);        // Forward
  } else if (dir == "B") {
    drive(-1, -1, -1, -1);    // Backward
  } else if (dir == "L") {
    drive(-1, 1, 1, -1);      // Strafe Left (Mecanum)
  } else if (dir == "R") {
    drive(1, -1, -1, 1);      // Strafe Right (Mecanum)
  } else if (dir == "C") {
    drive(1, -1, 1, -1);      // Rotate Clockwise
  } else if (dir == "A") {
    drive(-1, 1, -1, 1);      // Rotate Counter-Clockwise
  } else {
    stopMotors();
    return false;
  }

  activeDirection = dir;
  isMoving = true;
  lastMovementRefresh = millis();
  return true;
}

void enforceObstacleSafety() {
  if (!isMoving || emergencyStopped) return;

  if (directionBlocked(activeDirection)) {
    Serial.print("[AUTO SAFETY] Dynamic obstacle entered path. Stopping: ");
    Serial.println(activeDirection);
    stopMotors();
  }
}

// =====================================================
// REST API HANDLERS (CONNECTS TO RAW-BOT WEBSITE)
// =====================================================
void handleOptions() {
  sendCorsHeaders();
  server.send(204);
}

void handleMove() {
  sendCorsHeaders();

  if (!server.hasArg("dir")) {
    server.send(400, "text/plain", "Missing direction (dir parameter)");
    return;
  }

  String dir = server.arg("dir");
  dir.toUpperCase();

  if (dir == "S") {
    stopMotors();
    server.send(200, "text/plain", "Stopped");
    return;
  }

  if (dir != "F" && dir != "B" && dir != "L" && dir != "R" && dir != "A" && dir != "C") {
    server.send(400, "text/plain", "Invalid direction");
    return;
  }

  if (emergencyStopped) {
    stopMotors();
    server.send(423, "text/plain", "Emergency stop latched");
    return;
  }

  if (!mcpReady) {
    stopMotors();
    server.send(503, "text/plain", "MCP23017 chip unavailable");
    return;
  }

  if (!executeMovement(dir)) {
    server.send(409, "text/plain", "Obstacle within 20cm detected");
    return;
  }

  server.send(200, "text/plain", "Movement started: " + dir);
}

void handleHeartbeat() {
  sendCorsHeaders();

  if (emergencyStopped || !isMoving) {
    server.send(200, "text/plain", "Heartbeat OK (Idle)");
    return;
  }

  if (directionBlocked(activeDirection)) {
    stopMotors();
    server.send(409, "text/plain", "Obstacle detected");
    return;
  }

  lastMovementRefresh = millis();
  server.send(200, "text/plain", "OK");
}

void handleEmergency() {
  sendCorsHeaders();
  emergencyStopped = true;
  stopMotors();
  Serial.println("[SAFETY] EMERGENCY STOP LATCHED VIA WEBSITE");
  server.send(200, "text/plain", "Emergency stop active");
}

void handleDistances() {
  sendCorsHeaders();
  String json = "{";
  json += "\"front\":" + String(frontDistance, 1) + ",";
  json += "\"back\":" + String(backDistance, 1) + ",";
  json += "\"left\":" + String(leftDistance, 1) + ",";
  json += "\"right\":" + String(rightDistance, 1);
  json += "}";
  server.send(200, "application/json", json);
}

void handleRoot() {
  sendCorsHeaders();
  server.send(200, "text/plain", "RAW-BOT ESP32 Master Online. Ready for Web Commands.");
}

// =====================================================
// SETUP
// =====================================================
void setup() {
  Serial.begin(115200);
  delay(300);

  Serial.println("\n============================================");
  Serial.println("  RAW BOT — MECANUM AMR MASTER CONTROLLER   ");
  Serial.println("============================================");

  // Ultrasonic sensor pin configurations
  pinMode(FRONT_TRIG, OUTPUT);
  pinMode(BACK_TRIG, OUTPUT);
  pinMode(LEFT_TRIG, OUTPUT);
  pinMode(RIGHT_TRIG, OUTPUT);

  pinMode(FRONT_ECHO, INPUT);
  pinMode(BACK_ECHO, INPUT);
  pinMode(LEFT_ECHO, INPUT);
  pinMode(RIGHT_ECHO, INPUT);

  digitalWrite(FRONT_TRIG, LOW);
  digitalWrite(BACK_TRIG, LOW);
  digitalWrite(LEFT_TRIG, LOW);
  digitalWrite(RIGHT_TRIG, LOW);

  // Initialize I2C for MCP23017
  Wire.begin(I2C_SDA, I2C_SCL);

  if (mcp.begin_I2C(MCP_ADDRESS, &Wire)) {
    for (int pin = 0; pin < 8; pin++) {
      mcp.pinMode(pin, OUTPUT);
      mcp.digitalWrite(pin, LOW);
    }
    mcpReady = true;
    Serial.println("[MCP23017] Detected successfully at 0x20");
  } else {
    mcpReady = false;
    Serial.println("[ERROR] MCP23017 NOT FOUND! Check I2C wiring (Pins 21/22).");
  }

  // Wi-Fi Initialization
#if USE_WIFI_STATION
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] Connected to Network!");
  Serial.print("[WiFi] Robot IP Address: http://");
  Serial.println(WiFi.localIP());
#else
  WiFi.mode(WIFI_AP);
  WiFi.setSleep(false);
  if (WiFi.softAP(ssid, password)) {
    Serial.println("[WiFi] Hotspot Started: RAW_BOT");
    Serial.print("[WiFi] AP IP Address: http://");
    Serial.println(WiFi.softAPIP()); // Usually 192.168.4.1
  }
#endif

  // Mount Web / API Endpoints with CORS support
  server.on("/", HTTP_GET, handleRoot);
  server.on("/move", HTTP_GET, handleMove);
  server.on("/heartbeat", HTTP_GET, handleHeartbeat);
  server.on("/emergency", HTTP_GET, handleEmergency);
  server.on("/distances", HTTP_GET, handleDistances);

  // Handle CORS preflight requests
  server.on("/move", HTTP_OPTIONS, handleOptions);
  server.on("/heartbeat", HTTP_OPTIONS, handleOptions);
  server.on("/emergency", HTTP_OPTIONS, handleOptions);
  server.on("/distances", HTTP_OPTIONS, handleOptions);

  server.begin();
  updateSensors();

  Serial.println("[SYSTEM] Ready! Link this IP inside the RAW-BOT Web Navigation page.");
}

// =====================================================
// MAIN EXECUTION LOOP
// =====================================================
void loop() {
  server.handleClient();
  updateSensors();
  enforceObstacleSafety();

  // Safety: auto-stop if heartbeat expires during motion
  if (isMoving && (millis() - lastMovementRefresh > MOVEMENT_TIMEOUT)) {
    Serial.println("[SAFETY] Browser heartbeat timed out. Stopping motors.");
    stopMotors();
  }

  delay(1);
}
