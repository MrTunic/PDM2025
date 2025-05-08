let scene = "welcome";
let player;
let opponents = [];
let timer = 0;
let score = 0;
let lives = 3;
let planeImg, swarmImg, bomberImg, bgImg;
let barrelRollImgs = [];
let explosionImgs = [];
let explosions = [];
let port, connectionButton, zeroButton;
let lastButtonState = 0;
let audioStarted = false;
let joystickX = 512;
let joystickY = 512;
let joystickClick = false;
let externalButtonClick = false;

let useKeyboard = false; // Toggle for input mode

function preload() {
  planeImg = loadImage("media/plane1.png"); // 100x100 player biplane
  swarmImg = loadImage("media/drone_swarm.png"); // 100x100 swarm drone
  bomberImg = loadImage("media/drone_bomber.png"); // 100x100 bomber drone
  bgImg = loadImage("media/background.png"); // 800x600 background
  for (let i = 1; i <= 8; i++) {
    barrelRollImgs.push(loadImage(`media/barrel_roll_${i}.png`)); // 100x100 barrel roll frames
  }
  for (let i = 1; i <= 7; i++) {
    explosionImgs.push(loadImage(`media/explosion${i}.png`)); // 48x48 explosion frames
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.bullets = [];
    this.barrelRoll = false;
    this.rollTimer = 0;
    this.shootCooldown = 0;
    this.rollFrame = 0;
  }

  move(dx) {
    this.speed = dx * 5; // Adjusted speed
    this.x += this.speed;
    this.x = constrain(this.x, 0, width);
  }

  shoot() {
    if (this.shootCooldown <= 0) {
      this.bullets.push({ x: this.x, y: this.y - 20 });
      this.shootCooldown = 10;
      triggerShootSound();
    }
  }

  doBarrelRoll() {
    if (!this.barrelRoll) {
      this.barrelRoll = true;
      this.rollTimer = 30;
      this.rollFrame = 0;
    }
  }

  update() {
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.barrelRoll) {
      this.rollTimer--;
      this.rollFrame += 8 / 30;
      if (this.rollTimer <= 0) {
        this.barrelRoll = false;
        this.rollFrame = 0;
      }
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].y -= 5;
      if (this.bullets[i].y < 0) this.bullets.splice(i, 1);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (this.barrelRoll) {
      let frameIndex = floor(this.rollFrame) % 8;
      image(barrelRollImgs[frameIndex], -50, -50, 100, 100);
    } else {
      image(planeImg, -50, -50, 100, 100);
    }
    pop();
    for (let bullet of this.bullets) {
      fill(255);
      ellipse(bullet.x, bullet.y, 5, 5);
    }
  }
}

class Opponent {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.speed = type == 0 ? 3 : 1;
    this.health = type == 0 ? 1 : 3;
  }

  move() {
    this.y += this.speed;
    if (this.type == 0) this.x += sin(frameCount * 0.05) * 2;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(PI);
    image(this.type == 0 ? swarmImg : bomberImg, -50, -50, 100, 100);
    pop();
  }
}

function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height - 50);
  try {
    port = createSerial();
    connectionButton = createButton("Connect");
    connectionButton.mousePressed(connect);
    zeroButton = createButton("Zero Joystick");
    zeroButton.mousePressed(zero);
    connectionButton.position(10, height + 10);
    zeroButton.position(100, height + 10);
  } catch (e) {
    console.error("Failed to initialize serial port:", e);
  }
}

function connect() {
  if (!port.opened()) {
    try {
      port.open('Arduino', 9600);
      console.log("Serial port opened at 9600 baud");
    } catch (e) {
      console.error("Failed to open serial port:", e);
    }
  }
}

function zero() {
  if (port.opened()) {
    port.write('zero\n');
    console.log("Zero Joystick sent");
  }
}

function draw() {
  image(bgImg, 0, 0, 800, 600);

  // Read serial data
  let dx = 0;
  if (port && port.opened()) {
    let str = port.readUntil('\n');
    if (str !== "") {
      str = str.trim();
      const values = str.split(',');
      if (values.length === 4) {
        joystickX = Number(values[0]);
        joystickY = Number(values[1]);
        joystickClick = Number(values[2]) === 1;
        externalButtonClick = Number(values[3]) === 1;
      }
    }
    dx = map(joystickX, 0, 1023, -1, 1); // Inverted X control
    if (abs(dx) < 0.1) dx = 0; // Dead zone
  }

  if (scene == "welcome") {
    textAlign(CENTER);
    textSize(32);
    fill(0);
    text("Skybound Skirmish", width / 2, height / 3);
    textSize(20);
    text("Click or Press Enter to Start", width / 2, height / 2);
    if (mouseIsPressed || (keyIsPressed && keyCode == ENTER)) {
      scene = "game";
      timer = 90 * 60;
      score = 0;
      lives = 3;
      opponents = [];
      explosions = [];
      if (!player) player = new Player(width / 2, height - 50);
      if (!audioStarted) {
        async function startAudio() {
          await Tone.start();
          console.log("AudioContext started");
          Tone.Transport.start();
          pattern.start(0);
          audioStarted = true;
        }
        startAudio();
      }
    }
  } else if (scene == "game") {
    if (useKeyboard) {
      if (keyIsDown(LEFT_ARROW)) player.move(-1);
      if (keyIsDown(RIGHT_ARROW)) player.move(1);
      if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) player.move(0);
      if (keyIsDown(32) && lastButtonState == 0) { // Spacebar
        player.shoot();
        lastButtonState = 1;
      } else if (!keyIsDown(32)) {
        lastButtonState = 0;
      }
    } else {
      player.move(dx);
      if ((joystickClick || externalButtonClick) && lastButtonState == 0) {
        player.shoot();
        lastButtonState = 1;
      } else if (!(joystickClick || externalButtonClick)) {
        lastButtonState = 0;
      }
    }

    player.update();
    player.display();
    console.log("Player x:", player.x, "y:", player.y);

    if (frameCount % 60 == 0 && random() < 0.5) {
      opponents.push(new Opponent(random(width), 0, floor(random(2))));
    }

    for (let i = opponents.length - 1; i >= 0; i--) {
      opponents[i].move();
      opponents[i].display();
      if (opponents[i].y > height) {
        opponents.splice(i, 1);
        lives--;
        if (lives <= 0) {
          scene = "gameover";
          Tone.Transport.stop();
          pattern.stop();
        }
      } else {
        for (let j = player.bullets.length - 1; j >= 0; j--) {
          let bullet = player.bullets[j];
          let d = dist(bullet.x, bullet.y, opponents[i].x, opponents[i].y);
          if (d < (opponents[i].type == 0 ? 50 : 50)) {
            opponents[i].health--;
            player.bullets.splice(j, 1);
            if (opponents[i].health <= 0) {
              explosions.push({ x: opponents[i].x, y: opponents[i].y, timer: 30, frame: 0 });
              opponents.splice(i, 1);
              score += 10;
              triggerExplosionSound(); // Sends "buzz" to Arduino
            }
            break;
          }
        }
      }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
      let frameIndex = floor(explosions[i].frame) % 7;
      image(explosionImgs[frameIndex], explosions[i].x - 24, explosions[i].y - 24, 48, 48);
      explosions[i].timer--;
      explosions[i].frame += 7 / 30;
      if (explosions[i].timer <= 0) explosions.splice(i, 1);
    }

    textAlign(CENTER);
    fill(0);
    textSize(16);
    text(`Score: ${score}`, width / 2, 20);
    text(`Lives: ${lives}`, width / 2, 40);
    text(`Time: ${ceil(timer / 60)}`, width / 2, 60);

    textSize(12);
    text(useKeyboard ? "Controls: Keyboard (Move: Left/Right, Shoot: Space, Barrel Roll: E, Switch Controls: K)" : "Controls: Joystick (Move: Left/Right, Shoot: Joystick Button, Barrel Roll: E, Switch Controls: K)", width / 2, 80);

    timer--;
    if (timer <= 0) {
      scene = "gameover";
      Tone.Transport.stop();
      pattern.stop();
    }
  } else if (scene == "gameover") {
    textAlign(CENTER);
    textSize(32);
    fill(0);
    text("Game Over", width / 2, height / 3);
    textSize(20);
    text(`Final Score: ${score}`, width / 2, height / 2);
    text("Click or Press Enter to Restart", width / 2, height / 2 + 30);
    if (mouseIsPressed || (keyIsPressed && keyCode == ENTER)) {
      scene = "welcome";
      audioStarted = false;
    }
  }
}

function keyPressed() {
  if (key == "e" || key == "E") player.doBarrelRoll();
  if (key == "k" || key == "K") useKeyboard = !useKeyboard;
}

function triggerExplosionSound() {
  if (port && port.opened()) {
    port.write('buzz\n'); // Ensure buzzer triggers
    console.log("Sent buzz command");
  }
  sampler.triggerAttackRelease("C4", "8n");
}