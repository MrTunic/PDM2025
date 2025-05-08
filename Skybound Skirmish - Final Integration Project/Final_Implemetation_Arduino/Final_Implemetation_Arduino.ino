const int VRx = A0;
const int VRy = A1;
const int buttonPin = 4;
const int buzzerPin = 9; // Added buzzer pin

String inputString = "";
bool lastButtonState = HIGH;
bool joystickPressed = false;
bool externalButtonPressed = false;
int xVal = 512; // Default centered value
int yVal = 512;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);
}

void loop() {
  // Handle incoming messages from p5.js
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      inputString.trim();
      if (inputString == "buzz") {
        tone(buzzerPin, 500, 200); // 500 Hz for 200ms
      } else if (inputString == "zero") {
        xVal = 512;
        yVal = 512;
        joystickPressed = false;
        externalButtonPressed = false;
      }
      inputString = "";
    } else {
      inputString += inChar;
    }
  }

  // Read joystick
  xVal = analogRead(VRx);
  yVal = analogRead(VRy);

  // Read button
  bool currentButtonState = digitalRead(buttonPin);
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    joystickPressed = !joystickPressed;
  }
  lastButtonState = currentButtonState;

  // Send joystick and button state to p5
  Serial.print(xVal);
  Serial.print(",");
  Serial.print(yVal);
  Serial.print(",");
  Serial.print(joystickPressed ? 1 : 0);
  Serial.print(",");
  Serial.println(externalButtonPressed ? 1 : 0);

  delay(50);
}