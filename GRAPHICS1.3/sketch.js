let purple, meat, cyan;
let character1, character2, character3;

function preload() {
  purple = loadImage("purple.png");
  meat = loadImage("meat.png");
  cyan = loadImage("cyan.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  
  character1 = new Character (random(30,width),random(30,height), purple);
  character2 = new Character (random(30,width),random(30,height), meat);
  character3 = new Character (random(30,width),random(30,height), cyan);
}

function draw() {
  background(220);

  character1.draw();
  character2.draw();
  character3.draw();
}

function keyPressed() {
  character1.keyPressed();
  character2.keyPressed();
  character3.keyPressed();
}

function keyReleased() {
  character1.keyReleased();
  character2.keyReleased();
  character3.keyReleased();

}

class Character {
  constructor(x,y, spritesheet) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.currentAnimation = "stand";
    this.animations = {};

  this.addAnimation("right", new SpriteAnimation(spritesheet,2,0,7));
  this.addAnimation("left", new SpriteAnimation(spritesheet, 2,0,7, true));
  this.addAnimation("stand", new SpriteAnimation(spritesheet, 0,0,1));
  this.addAnimation("standLeft", new SpriteAnimation(spritesheet, 0,0,1, true));
  }

addAnimation(key, animation) {
  this.animations[key] = animation;
}

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "right" :
          this.x += 2;
          break;
        case "left" :
          this.x -= 2;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }

  keyPressed() {
    switch(keyCode) {
      case RIGHT_ARROW:
        this.currentAnimation = "right";
        break;
      case LEFT_ARROW:
        this.currentAnimation = "left";
        this.animations["left"].flipped = true;
        break;
  }
}

 keyReleased () {
    this.currentAnimation = "stand";
    this.animations[this.currentAnimation].flipped = false;
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration, flipped = false) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = flipped;
  }

  draw() {
    push();
    let s = (this.flipped) ?  -1 : 1;
    scale(s,1);
    image(this.spritesheet, 0, 0, 80, 80, this.u*80, this.v*80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 10 === 0)
      this.u++;

    if (this.u === this.startU + this.duration)
      this.u = this.startU;
    pop();
  }
}