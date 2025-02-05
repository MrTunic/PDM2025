let colors = ['orange', 'blue', 'red', 'green', 'yellow', 'magenta', 'black', 'white', 'brown', 'cyan'];
let dragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(1000);
  colorMode(HSB)
}

function draw() {
  noStroke();
  
  fill('red');
  square(0, 2, 40);

  fill('orange');
  square(0, 42, 40);

  fill('yellow');
  square(0, 82, 40);

  fill('green');
  square(0, 122, 40);

  fill('cyan');
  square(0, 162, 40);

  fill('blue');
  square(0, 202, 40);

  fill('magenta');
  square(0, 242, 40);

  fill('brown');
  square(0, 282, 40);

  fill('white');
  square(0, 322, 40);

  fill('black');
  square(0, 362, 40);

  if (dragging && mouseX > 55) {
  stroke(selectedColor);
  strokeWeight(10);
  line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function mousePressed() {
  let line = mouseX - mouseY;

  if (mouseX >= 0 && mouseX <= 40) {
    if (pmouseY >= 2 && pmouseY <= 42) selectedColor = 'red';
    else if (pmouseY >= 42 && pmouseY <= 82) selectedColor = 'orange';
    else if (pmouseY >= 82 && pmouseY <= 122) selectedColor = 'yellow';
    else if (pmouseY >= 122 && pmouseY <= 162) selectedColor = 'green';
    else if (pmouseY >= 162 && pmouseY <= 202) selectedColor = 'cyan';
    else if (pmouseY >= 202 && pmouseY <= 242) selectedColor = 'blue';
    else if (pmouseY >= 242 && pmouseY <= 282) selectedColor = 'magenta';
    else if (pmouseY >= 282 && pmouseY <= 322) selectedColor = 'brown';
    else if (pmouseY >= 322 && pmouseY <= 362) selectedColor = 'white';
    else if (pmouseY >= 362 && pmouseY <= 402) selectedColor = 'black';
  } else {
    dragging = true;
  }
}

function mouseReleased() {
  dragging = false;
}