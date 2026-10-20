/*
 * ==============================================================================
 * RAW BOT — ROBOTIC AUTONOMOUS WAREHOUSE BOT
 * ESP32 Autonomous Hardware Controller Firmware
 * ==============================================================================
 * Hardware Components:
 * - ESP32 DevKit V1
 * - 4x Mecanum Wheels + 4x N20/DC Encoders with L298N/TB6612 Motor Drivers
 * - HC-SR04 Ultrasonic Distance Sensor (Front obstacle avoidance)
 * - 2x TCRT5000 IR Proximity Sensors (Left/Right collision guard)
 * - RC522 RFID Reader (Pallet & Station verification)
 * - ESP32-CAM or Serial QR Barcode Scanner (Package QR decoding)
 * - Linear Actuator (Lifting platform up/down) with Limit Switches
 * - Voltage Divider (12V LiPo Battery monitoring)
 * - Wireless Charging Receiver Coil
 * ==============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Wi-Fi Configuration
const char* WIFI_SSID = "YOUR_WAREHOUSE_WIFI";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend API / Firebase Endpoint
const char* BACKEND_SERVER = "http://192.168.1.100:5000/api";
const char* ROBOT_ID = "RBT-01";

// Pin Definitions
#define PIN_TRIG 5
#define PIN_ECHO 18
#define PIN_IR_LEFT 19
#define PIN_IR_RIGHT 21
#define PIN_BATTERY_ADC 34
#define PIN_LIFT_UP 22
#define PIN_LIFT_DOWN 23
#define PIN_LIMIT_TOP 32
#define PIN_LIMIT_BOTTOM 33

// Motor Driver PWM Pins
#define MOTOR_FL_PWM 25
#define MOTOR_FR_PWM 26
#define MOTOR_BL_PWM 27
#define MOTOR_BR_PWM 14

// State Variables
String currentCommand = "STOP";
String currentStatus = "IDLE";
String currentLocation = "A1";
String destination = "B2";
float batteryLevel = 85.0;
float cargoWeight = 0.72;
bool isLiftUp = false;
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 1000; // Send telemetry every 1 sec

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n[RAW BOT] Booting Autonomous Hardware Controller...");

  // Sensor Pins
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_IR_LEFT, INPUT);
  pinMode(PIN_IR_RIGHT, INPUT);
  pinMode(PIN_BATTERY_ADC, INPUT);

  // Actuator Pins
  pinMode(PIN_LIFT_UP, OUTPUT);
  pinMode(PIN_LIFT_DOWN, OUTPUT);
  pinMode(PIN_LIMIT_TOP, INPUT_PULLUP);
  pinMode(PIN_LIMIT_BOTTOM, INPUT_PULLUP);

  stopLifting();

  // Connect to Warehouse Wi-Fi
  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    return;
  }

  // 1. Read Physical Sensors
  float distanceCm = readUltrasonic();
  bool irLeft = digitalRead(PIN_IR_LEFT) == LOW;
  bool irRight = digitalRead(PIN_IR_RIGHT) == LOW;
  batteryLevel = readBatteryPercentage();

  // 2. Obstacle Emergency Stop Protection
  if (distanceCm > 0 && distanceCm < 20.0) {
    if (currentCommand == "START" || currentCommand == "RESUME") {
      Serial.println("[ALERT] Front obstacle detected within 20cm! Halting motors.");
      stopMotors();
      currentStatus = "OBSTACLE_HALT";
      sendEmergencyAlert("Front obstacle detected at " + String(distanceCm) + " cm");
    }
  }

  // 3. Periodic Telemetry Broadcast & Command Fetch
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = millis();
    syncWithBackend(distanceCm, irLeft, irRight);
  }

  // 4. Execute Motors based on currentCommand
  executeAutonomousControl();
  
  delay(20);
}

void connectWiFi() {
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[WiFi] Connection timeout. Retrying next cycle...");
  }
}

float readUltrasonic() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 30000);
  if (duration == 0) return 999.0;
  return duration * 0.034 / 2.0;
}

float readBatteryPercentage() {
  int raw = analogRead(PIN_BATTERY_ADC);
  float voltage = (raw / 4095.0) * 3.3 * 4.0; // 4:1 voltage divider for 12.6V 3S pack
  float pct = ((voltage - 10.5) / (12.6 - 10.5)) * 100.0;
  return constrain(pct, 0.0, 100.0);
}

void syncWithBackend(float ultrasonicCm, bool irLeft, bool irRight) {
  HTTPClient http;
  String url = String(BACKEND_SERVER) + "/robots/" + ROBOT_ID;
  
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    if (doc["success"]) {
      String remoteStatus = doc["data"]["status"].as<String>();
      String dest = doc["data"]["destination"].as<String>();
      destination = dest;

      // Handle remote commands
      if (remoteStatus == "Working") {
        currentCommand = "START";
      } else if (remoteStatus == "Idle") {
        currentCommand = "STOP";
      } else if (remoteStatus == "Emergency Stop") {
        currentCommand = "EMERGENCY_STOP";
      }
    }
  }
  http.end();

  // Send Sensor Telemetry Update
  HTTPClient updateHttp;
  String updateUrl = String(BACKEND_SERVER) + "/robots/" + ROBOT_ID;
  updateHttp.begin(updateUrl);
  updateHttp.addHeader("Content-Type", "application/json");

  DynamicJsonDocument telemetry(512);
  telemetry["battery"] = batteryLevel;
  telemetry["currentLocation"] = currentLocation;
  JsonObject sensors = telemetry.createNestedObject("sensors");
  sensors["ultrasonic"] = ultrasonicCm;
  sensors["irLeft"] = irLeft;
  sensors["irRight"] = irRight;

  String jsonBody;
  serializeJson(telemetry, jsonBody);
  updateHttp.PUT(jsonBody);
  updateHttp.end();
}

void sendEmergencyAlert(String message) {
  HTTPClient http;
  http.begin(String(BACKEND_SERVER) + "/alerts");
  http.addHeader("Content-Type", "application/json");
  DynamicJsonDocument doc(256);
  doc["type"] = "Critical";
  doc["robotId"] = ROBOT_ID;
  doc["message"] = message;
  String body;
  serializeJson(doc, body);
  http.POST(body);
  http.end();
}

void executeAutonomousControl() {
  if (currentCommand == "EMERGENCY_STOP" || currentCommand == "STOP") {
    stopMotors();
    currentStatus = "STOPPED";
  } else if (currentCommand == "START" || currentCommand == "RESUME") {
    // Mecanum autonomous trajectory control
    driveForward(180);
    currentStatus = "NAVIGATING";
  }
}

void driveForward(int speed) {
  analogWrite(MOTOR_FL_PWM, speed);
  analogWrite(MOTOR_FR_PWM, speed);
  analogWrite(MOTOR_BL_PWM, speed);
  analogWrite(MOTOR_BR_PWM, speed);
}

void stopMotors() {
  analogWrite(MOTOR_FL_PWM, 0);
  analogWrite(MOTOR_FR_PWM, 0);
  analogWrite(MOTOR_BL_PWM, 0);
  analogWrite(MOTOR_BR_PWM, 0);
}

void raisePlatform() {
  if (digitalRead(PIN_LIMIT_TOP) != LOW) {
    digitalWrite(PIN_LIFT_UP, HIGH);
    digitalWrite(PIN_LIFT_DOWN, LOW);
  } else {
    stopLifting();
    isLiftUp = true;
  }
}

void lowerPlatform() {
  if (digitalRead(PIN_LIMIT_BOTTOM) != LOW) {
    digitalWrite(PIN_LIFT_UP, LOW);
    digitalWrite(PIN_LIFT_DOWN, HIGH);
  } else {
    stopLifting();
    isLiftUp = false;
  }
}

void stopLifting() {
  digitalWrite(PIN_LIFT_UP, LOW);
  digitalWrite(PIN_LIFT_DOWN, LOW);
}
