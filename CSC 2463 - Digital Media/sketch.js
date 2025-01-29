function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
}

function draw() {
  background(255);

  fill(144, 238, 144);
  rect(10, 10, 270, 130)
  
  strokeWeight(2);
  stroke(0);
  fill(255);
  circle(75, 75, 100);
  square(150, 25, 100);

                  // End of Drawing 1
  ///---------------------------------------///

  //Create a color array
  let c = color(255, 128, 128);
  
  // Draw the circles
  noStroke();
  fill(c);
  circle(150, 300, 100);
  
  // Set alphavalue value
  c.setAlpha(128);
  
///-----End-----///----Of-----///-----Circle-1-----///
  
  // 2 - Create a color array
  d = color(0, 128, 0);
  
  // 2 - Draw the circles
  d.setAlpha(128);
  fill(d);
  circle(175, 350, 100);

  // 2 - Set alphavalue value
  
  
///-----End-----///----Of----///-----Circle-2------///


  // 3 - Create a color array
  let e = color(0, 0, 128);
  
  // 3 - Draw the circles
  e.setAlpha(128);
  fill(e);
  circle(125, 350, 100);

  // 3 - Set alphavalue value

                  // End of Drawing 2
  ///---------------------------------------///

  fill(0, 0, 0);
  rect(10, 500, 270, 130);

  fill(255, 255, 0);
  arc(70, 565, 100, 100, radians(210), radians(150));
  
 ///------Ghost-------///-------Drawing--------///
  
  // Ghost Body
  fill(225, 0, 0);
  rect(150, 565, 94, 45);
  arc(197, 565, 94, 90, radians(180), radians(0));

  // Ghost Eyes
  fill(225);
  circle(175, 565, 25);
  circle(215, 565, 25);

  // Ghost Eyes
  fill(0, 0, 225);
  circle(175, 565, 15);
  circle(215, 565, 15);

              // End of Drawing 3
  ///---------------------------------------///

  fill(0, 0, 225);
  square(380, 380, 250);

  strokeWeight(4);
  stroke(225);
  fill(34, 139, 34);
  circle(505, 505, 150);
  
  fill(255,0,0)
  beginShape();
  vertex(505, 430);  // Top point
  vertex(523, 481);  // Upper right
  vertex(576, 482);  // Right edge
  vertex(534, 514);  // Inner right
  vertex(549, 566);  // Bottom right
  vertex(505, 535);  // Bottom middle
  vertex(461, 566);  // Bottom left
  vertex(476, 514);  // Inner left
  vertex(434, 482);  // Left edge
  vertex(487, 481);  // Upper left
  endShape(CLOSE);


}