/*
 * ==============================================================================
 * RAW BOT — SLAVE ESP32 CONTROLLER FIRMWARE
 * Motorized Scissor Lift + HX711 Load Cell + Limit Switches + Battery Monitor
 * ==============================================================================
 * Hardware Pin Connections:
 * - Scissor Lift Actuator / Motor Driver (L298N / Relay):
 *     PIN_LIFT_IN1 -> GPIO 25 (Lift UP)
 *     PIN_LIFT_IN2 -> GPIO 26 (Lift DOWN)
 * - Limit Switches (Safety stops for scissor lift):
 *     PIN_LIMIT_TOP    -> GPIO 32 (Stops motor when lift reaches top)
 *     PIN_LIMIT_BOTTOM -> GPIO 33 (Stops motor when lift is fully down)
 * - HX711 Load Cell Amplifier (Empty Box / Cargo Weight Sensor):
 *     HX711_DOUT -> GPIO 19
 *     HX711_SCK  -> GPIO 18
 * - Battery Voltage Divider (12V LiPo Pack):
 *     PIN_BATTERY_ADC -> GPIO 34 (Analog In, 4:1 voltage divider)
 * - Inter-ESP32 Hardware Serial Link (Slave -> Master):
 *     TX2 -> GPIO 17 (Connects to Master RX2 GPIO 16)
 *     RX2 -> GPIO 16 (Connects to Master TX2 GPIO 17)
 *     GND -> Common GND with Master ESP32
 * ==============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "HX711.h"

// --- WI-FI & FIREBASE CONFIGURATION ---
const char* WIFI_SSID = "YOUR_WIFI_SSID";           // Replace with your Wi-Fi name / phone hotspot
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Replace with your Wi-Fi password
const char* FIREBASE_HOST = "https://raw-bot-3caa5-default-rtdb.firebaseio.com";

// --- PIN DEFINITIONS ---
#define PIN_LIFT_IN1     25
#define PIN_LIFT_IN2     26
#define PIN_LIMIT_TOP    32
#define PIN_LIMIT_BOTTOM 33

#define HX711_DOUT_PIN   19
#define HX711_SCK_PIN    18

#define PIN_BATTERY_ADC  34

// --- HARDWARE OBJECTS & CONSTANTS ---
HX711 scale;
const float CALIBRATION_FACTOR = 420.0; // Adjust after calibrating with known 200g weight
const float MAX_WEIGHT_LIMIT   = 1.0;   // Safety interlock: 1.0 kg max cargo limit

// --- STATE VARIABLES ---
String liftState = "DOWN"; // "UP", "DOWN", "MOVING_UP", "MOVING_DOWN"
float currentWeight = 0.20; // kg
float batteryPct = 85.0;
unsigned long lastTelemetrySync = 0;
const unsigned long SYNC_INTERVAL = 1000; // 1 second

// =====================================================
// SCISSOR LIFT MOTOR FUNCTIONS
// =====================================================
void stopLift() {
  digitalWrite(PIN_LIFT_IN1, LOW);
  digitalWrite(PIN_LIFT_IN2, LOW);
}

void raiseLift() {
  // If top limit switch pressed (Active LOW), do not move
  if (digitalRead(PIN_LIMIT_TOP) == LOW) {
    stopLift();
    liftState = "UP";
    return;
  }
  digitalWrite(PIN_LIFT_IN1, HIGH);
  digitalWrite(PIN_LIFT_IN2, LOW);
  liftState = "MOVING_UP";
}

void lowerLift() {
  // If bottom limit switch pressed (Active LOW), do not move
  if (digitalRead(PIN_LIMIT_BOTTOM) == LOW) {
    stopLift();
    liftState = "DOWN";
    return;
  }
  digitalWrite(PIN_LIFT_IN1, LOW);
  digitalWrite(PIN_LIFT_IN2, HIGH);
  liftState = "MOVING_DOWN";
}

// =====================================================
// SENSOR READINGS
// =====================================================
float readWeight() {
  if (scale.is_ready()) {
    long reading = scale.get_units(5); // Average of 5 readings
    float kg = reading / 1000.0f;     // Convert grams to kg
    if (kg < 0.05) kg = 0.0;          // Zero out sensor noise
    return kg;
  }
  return currentWeight;
}

float readBattery() {
  int raw = analogRead(PIN_BATTERY_ADC);
  // ESP32 12-bit ADC (0-4095) with 3.3V ref and 4:1 voltage divider
  float measuredVoltage = (raw / 4095.0f) * 3.3f * 4.0f;
  // 3S LiPo: 10.5V (0%) to 12.6V (100%)
  float pct = ((measuredVoltage - 10.5f) / (12.6f - 10.5f)) * 100.0f;
  return constrain(pct, 0.0f, 100.0f);
}

// =====================================================
// DIRECT FIREBASE CLOUD SYNC
// =====================================================
void pushTelemetryToFirebase(float weight, String lift, float battery) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(FIREBASE_HOST) + "/robot.json";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  // Create JSON payload
  DynamicJsonDocument doc(256);
  doc["weight"] = weight;
  doc["lift"] = lift;
  doc["battery"] = battery;

  // Safety Overload Check
  if (weight > MAX_WEIGHT_LIMIT) {
    doc["error"] = "OVERLOAD_DETECTED";
  } else {
    doc["error"] = "";
  }

  String jsonBody;
  serializeJson(doc, jsonBody);

  // PATCH updates fields without overwriting the rest of /robot
  int httpCode = http.PATCH(jsonBody);
  if (httpCode == 200) {
    Serial.printf("[FIREBASE] Telemetry Pushed -> Weight: %.2f kg | Lift: %s | Batt: %.1f%%\n",
      weight, lift.c_str(), battery);
  }
  http.end();

  // If overloaded, trigger Critical Alert in Firebase
  if (weight > MAX_WEIGHT_LIMIT) {
    HTTPClient alertHttp;
    String alertUrl = String(FIREBASE_HOST) + "/alerts.json";
    alertHttp.begin(alertUrl);
    alertHttp.addHeader("Content-Type", "application/json");

    DynamicJsonDocument alertDoc(256);
    alertDoc["type"] = "Critical";
    alertDoc["message"] = "Weight Warning: Cargo weight (" + String(weight, 2) + " kg) exceeds 1.0 kg limit!";
    alertDoc["robotId"] = "RBT-01";
    alertDoc["status"] = "Unread";
    alertDoc["time"] = "LIVE";

    String alertBody;
    serializeJson(alertDoc, alertBody);
    alertHttp.POST(alertBody);
    alertHttp.end();
  }
}

// Read commands directed to the lift from Firebase
void checkFirebaseLiftCommand() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(FIREBASE_HOST) + "/robot/lift.json";
  http.begin(url);
  int httpCode = http.GET();
  if (httpCode == 200) {
    String payload = http.getString();
    payload.replace("\"", "");
    payload.trim();

    if (payload == "UP" && liftState != "UP") {
      // Check weight before lifting
      if (currentWeight <= MAX_WEIGHT_LIMIT) {
        Serial.println("[LIFT] Command received: UP");
        raiseLift();
      } else {
        Serial.println("[SAFETY] Lift UP blocked: Package weight exceeds 1.0 kg!");
        stopLift();
      }
    } else if (payload == "DOWN" && liftState != "DOWN") {
      Serial.println("[LIFT] Command received: DOWN");
      lowerLift();
    }
  }
  http.end();
}

// =====================================================
// SETUP
// =====================================================
void setup() {
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, 16, 17); // Hardware Serial to Master ESP32

  delay(300);
  Serial.println("\n============================================");
  Serial.println("  RAW BOT — SLAVE CONTROLLER (LIFT & WEIGHT) ");
  Serial.println("============================================");

  pinMode(PIN_LIFT_IN1, OUTPUT);
  pinMode(PIN_LIFT_IN2, OUTPUT);
  pinMode(PIN_LIMIT_TOP, INPUT_PULLUP);
  pinMode(PIN_LIMIT_BOTTOM, INPUT_PULLUP);
  pinMode(PIN_BATTERY_ADC, INPUT);

  stopLift();

  // Initialize HX711 Load Cell
  scale.begin(HX711_DOUT_PIN, HX711_SCK_PIN);
  scale.set_scale(CALIBRATION_FACTOR);
  scale.tare(); // Zero the scale at boot
  Serial.println("[HX711] Load cell tared and ready");

  // Connect to Wi-Fi
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(400);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[WiFi] Offline mode. Operating via Serial2 with Master.");
  }
}

// =====================================================
// MAIN LOOP
// =====================================================
void loop() {
  // 1. Safety check limit switches during motion
  if (liftState == "MOVING_UP" && digitalRead(PIN_LIMIT_TOP) == LOW) {
    stopLift();
    liftState = "UP";
    Serial.println("[LIMIT] Top limit reached. Lift UP locked.");
  }

  if (liftState == "MOVING_DOWN" && digitalRead(PIN_LIMIT_BOTTOM) == LOW) {
    stopLift();
    liftState = "DOWN";
    Serial.println("[LIMIT] Bottom limit reached. Lift DOWN locked.");
  }

  // 2. Periodic Sensor Refresh & Firebase Sync
  if (millis() - lastTelemetrySync >= SYNC_INTERVAL) {
    lastTelemetrySync = millis();

    currentWeight = readWeight();
    batteryPct    = readBattery();

    // Check Firebase for lift commands (UP / DOWN)
    checkFirebaseLiftCommand();

    // Push live readings to Firebase Cloud
    pushTelemetryToFirebase(currentWeight, liftState, batteryPct);

    // Also mirror telemetry to Master ESP32 via Serial2
    Serial2.printf("{\"weight\":%.2f,\"lift\":\"%s\",\"battery\":%.1f}\n",
      currentWeight, liftState.c_str(), batteryPct);
  }

  delay(10);
}
