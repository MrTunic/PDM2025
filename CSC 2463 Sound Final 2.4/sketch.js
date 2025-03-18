let bugs = [];
let squishedCount = 0;
let timeLeft = 30;
let gameOver = false;
let bugSprites;
let squishedSprite;
let frameIndex = 0;
let frameDelay = 5;
let frameCounter = 0;

// Sound variables
let backgroundMusic;
let squishSound;
let missSound;
let skitterOsc;
let gameOverSound;
let gameState = "start";

function preload() {
    // Load in the sprite sheets from media folder
    bugSprites = loadImage('media/bug_sprites.png');
    squishedSprite = loadImage('media/squished_bug.png');
    
    // Load in audio files from media folder
    soundFormats('mp3', 'wav');
    backgroundMusic = loadSound('media/backgroundMusic.wav');
    squishSound = loadSound('media/squishSound.wav');
    missSound = loadSound('media/missSound.wav');
    gameOverSound = loadSound('media/gameOverMusic.wav');
}

function setup() {
    createCanvas(600, 400);
    
    // Initialize bugs
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height)));
    }
    
    // Timer
    setInterval(() => {
        if (timeLeft > 0 && gameState === "playing") timeLeft--;
        else if (gameState === "playing") {
            gameOver = true;
            gameState = "over";
            playGameOverSound();
        }
    }, 1000);
    
    // Initializes the oscillator for bug skittering
    skitterOsc = new p5.Oscillator('triangle');
    skitterOsc.amp(0);
    skitterOsc.start();
    
    // Starts background music
    backgroundMusic.loop();
    backgroundMusic.setVolume(0.3);
}

function draw() {
    background(200);
    
    if (gameState === "start") {
        displayStartScreen();
    } else if (gameState === "playing") {
        updateGame();
        // This adjusts background music speed based on time
        let playbackRate = map(timeLeft, 30, 0, 0.8, 1.2);
        backgroundMusic.rate(playbackRate);
        
        // Adjusts the skitter sounds based on number of bugs
        let freq = map(bugs.length, 5, 15, 200, 600);
        skitterOsc.freq(freq);
        skitterOsc.amp(0.2, 0.1);
    } else if (gameState === "over") {
        displayGameOver();
    }
}

function displayStartScreen() {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text("Bug Squish!", width/2, height/2 - 20);
    textSize(20);
    text("Click to Start", width/2, height/2 + 20);
}

function displayGameOver() {
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over!", width/2, height/2);
    text(`Final Score: ${squishedCount}`, width/2, height/2 + 40);
}

function updateGame() {
    for (let bug of bugs) {
        bug.move();
        bug.display();
    }
    
    fill(0);
    textSize(20);
    text(`Squished: ${squishedCount}`, 20, 30);
    text(`Time: ${timeLeft}`, width - 100, 30);
    
    frameCounter++;
    if (frameCounter >= frameDelay) {
        frameCounter = 0;
        frameIndex = (frameIndex + 1) % 7;
    }
}

function mousePressed() {
    if (gameState === "start") {
        gameState = "playing";
        return;
    }
    
    if (gameState === "playing") {
        let bugHit = false;
        for (let bug of bugs) {
            if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
                bug.squish();
                squishedCount++;
                squishSound.play();
                bugs.push(new Bug(random(width), random(height), bug.speed * 1.1));
                bugHit = true;
                break;
            }
        }
        if (!bugHit && !gameOver) {
            missSound.play();
        }
    }
}

function playGameOverSound() {
    backgroundMusic.stop();
    skitterOsc.amp(0, 0.5);
    gameOverSound.play();
}

class Bug {
    constructor(x, y, speed = 2) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.squished = false;
        this.direction = p5.Vector.random2D();
    }
    
    move() {
        if (!this.squished) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
            
            if (this.x < 0 || this.x > width) this.direction.x *= -1;
            if (this.y < 0 || this.y > height) this.direction.y *= -1;
        }
    }
    
    display() {
        if (this.squished) {
            image(squishedSprite, this.x - 15, this.y - 15, 30, 30);
        } else {
            push();
            translate(this.x, this.y);
            rotate(atan2(this.direction.y, this.direction.x) + HALF_PI);
            image(bugSprites, -15, -15, 30, 30, frameIndex * 32, 0, 32, 32);
            pop();
        }
    }
    
    isClicked(mx, my) {
        return dist(mx, my, this.x, this.y) < 15;
    }
    
    squish() {
        this.squished = true;
    }
}