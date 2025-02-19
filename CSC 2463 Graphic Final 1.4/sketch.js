let bugs = [];
let squishedCount = 0;
let timeLeft = 30;
let gameOver = false;
let bugSprites;
let squishedSprite;
let frameIndex = 0;
let frameDelay = 5;
let frameCounter = 0;

function preload() {
    bugSprites = loadImage('bug_sprites.png'); // Bug Sprite Sheet
    squishedSprite = loadImage('squished_bug.png'); // Bug(Squished Edition) image
}

// Create the canvas, the intial bugs, and the timer
function setup() {
    createCanvas(600, 400);
    // Used for loop to create bugs and push them into the array
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height)));
    }
    // SetInterval to decrement the timeLeft by 1 every second
    setInterval(() => {
        if (timeLeft > 0) timeLeft--;
        else gameOver = true;
    }, 1000);
}

// Check if the game is over, if not, move and display the bugs and their animations
function draw() {
    background(200);
    
    // Check if the game is over
    if (!gameOver) {
        for (let bug of bugs) {
            bug.move();
            bug.display();
        }
        
        // Display the squished bug count and the time left
        fill(0);
        textSize(20);
        text(`Squished: ${squishedCount}`, 20, 30);
        text(`Time: ${timeLeft}`, width - 100, 30);
        
        frameCounter++;
        if (frameCounter >= frameDelay) {
            frameCounter = 0;
            frameIndex = (frameIndex + 1) % 7; // Cycle through animation frames
        }
    } else { // Display game over message if the game is over (Obviuosly lol)
        textSize(32);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2);
        text(`Final Score: ${squishedCount}`, width / 2, height / 2 + 40);
    }
}

// Check if a bug is clicked ("mousePressed" can only be triggers once per click, to avoid dragging), if so, squish it and add a new bug
function mousePressed() {
    for (let bug of bugs) {
        if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
            bug.squish();
            squishedCount++;
            bugs.push(new Bug(random(width), random(height), bug.speed * 1.1));
        }
    }
}

// Bug class: Contains the bug's position, speed, squished status, and direction
class Bug {
    constructor(x, y, speed = 2) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.squished = false;
        this.direction = p5.Vector.random2D();
    }
    
    // Move the bug in the direction it is facing, and bounce off the walls
    move() {
        if (!this.squished) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;
            
            if (this.x < 0 || this.x > width) this.direction.x *= -1;
            if (this.y < 0 || this.y > height) this.direction.y *= -1;
        }
    }
    
    // Display the bug or the squished bug
    display() {
        if (this.squished) {
            image(squishedSprite, this.x - 15, this.y - 15, 30, 30);
        } else {
            push();
            translate(this.x, this.y);
            rotate(atan2(this.direction.y, this.direction.x) + HALF_PI); // Fix rotation due to my drawing having the wrong orientation
            image(bugSprites, -15, -15, 30, 30, frameIndex * 32, 0, 32, 32);
            pop();
        }
    }
    
    // Check if the bug is clicked
    isClicked(mx, my) {
        return dist(mx, my, this.x, this.y) < 15;
    }
    
    // Squish the bug
    squish() {
        this.squished = true;
    }
}
