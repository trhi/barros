let numCircles = 3; // Number of concentric circles
let circleSpacing = 50; // Spacing between the circles
let circleSizes = [100, 150, 200]; // Sizes of the circles
let circleRotationSpeeds = [0.02, 0.01, 0.005]; // Speeds of rotation for each circle
let circles = []; // Array to store the circles
let textInputs = []; // Array to store the input fields for each circle
let selectedCircle = null; // The circle currently being rotated
let mouseOffsetX, mouseOffsetY; // The offset between the mouse and the center of the selected circle

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  for (let i = 0; i < numCircles; i++) {
    let circle = {
      x: width / 2,
      y: height / 2,
      size: circleSizes[i],
      angle: 0,
      rotationSpeed: circleRotationSpeeds[i],
      text: ''
    };
    circles.push(circle);
    let textInput = createInput('Type here'); // Create an input field for each circle
    textInput.position(width / 2 - 50, height / 2 - circleSizes[i] - 30);
    textInput.size(100);
    textInputs.push(textInput);
  }
}

function draw() {
  background(220);
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    let angle = circle.angle;
    if (circle == selectedCircle) { // If the circle is being rotated, update its angle based on the mouse position
      angle = atan2(mouseY - circle.y - mouseOffsetY, mouseX - circle.x - mouseOffsetX);
    } else { // Otherwise, update its angle based on its rotation speed
      angle += circle.rotationSpeed;
    }
    let x = circle.x + circle.size * cos(angle);
    let y = circle.y + circle.size * sin(angle);
    circle.angle = angle;
    stroke(0);
    noFill();
    ellipse(circle.x, circle.y, circle.size);
    let text = circle.text;
    let textInput = textInputs[i];
    if (textInput.value() != '') { // Use the input field value if it's not empty
      text = textInput.value();
    }
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text(text, x, y); // Draw the text along the arc of the circle
  }
}

function mousePressed() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    let d = dist(mouseX, mouseY, circle.x, circle.y);
    if (d < circle.size / 2) { // If the mouse is inside a circle, select it for rotation
      selectedCircle = circle;
      mouseOffsetX = mouseX - circle.x;
      mouseOffsetY = mouseY - circle.y;
      break;
    }
  }
}

function mouseReleased() {
  selectedCircle = null; // Deselect the circle when the mouse is released
}

function keyPressed() {
  if (keyCode === ENTER) {
    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i];
      let textInput = textInputs[i];
