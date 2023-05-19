let numCircles = 5; // Number of concentric circles
let circleSpacing = 30; // Spacing between the circles
let circleSize = 50; // Size of the circles
let rotationSpeed = 0.01; // Speed of rotation
let circles = []; // Array to store the circles
let textInput; // Input field for adding text

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  textInput = createInput('Type here'); // Create an input field for adding text
  textInput.position(width/2 - 50, height - 50);
  textInput.size(100);
  for (let i = 0; i < numCircles; i++) {
    let circle = {
      x: width / 2,
      y: height / 2,
      size: circleSize + i * circleSpacing,
      angle: 0,
      text: ''
    };
    circles.push(circle);
  }
}

function draw() {
  background(220);
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    let angle = circle.angle + i * 10; // Vary the angle of rotation based on circle index
    let x = circle.x + circle.size * cos(angle);
    let y = circle.y + circle.size * sin(angle);
    circle.angle += rotationSpeed;
    stroke(0);
    noFill();
    ellipse(circle.x, circle.y, circle.size);
    fill(0);
    textSize(20);
    text(circle.text, x, y);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i];
      circle.text = textInput.value(); // Set the text of all circles to the input value
    }
    textInput.value('');
  }
}
