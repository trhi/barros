let circle1, circle2, circle3; // Three circles
let circleSpacing = 80; // Spacing between the circles
let circleSize = 150; // Size of the circles
let rotationSpeed = 0.01; // Speed of rotation
let textInput1, textInput2, textInput3; // Input fields for adding text

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);

  // Create the three circles
  circle1 = new Circle(width / 2, height / 2, circleSize, 0, []);
  circle2 = new Circle(width / 2, height / 2, circleSize + circleSpacing, 0, []);
  circle3 = new Circle(width / 2, height / 2, circleSize + circleSpacing * 2, 0, []);

  // Create input fields for adding text to each circle
  textInput1 = createInput(' runs  walks  sleeps cries ');
  textInput1.position(50, height - 50);
  textInput1.size(100);
  textInput2 = createInput(' house  telephone  pencil  sun  moon ');
  textInput2.position(width / 2 - 50, height - 50);
  textInput2.size(100);
  textInput3 = createInput(' stormy  gloomy  noisy  powdered  raging  altered ');
  textInput3.position(width - 150, height - 50);
  textInput3.size(100);
}

function draw() {
  background(220);

  // Draw each circle
  circle1.display();
  circle2.display();
  circle3.display();
}

// Circle class
class Circle {
  constructor(x, y, size, angle, text) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = angle;
    this.text = text;
  }

  display() {
    // Calculate the position of each text element in an arc along the circle
    let textRadius = this.size / 2;
    let numTextElements = this.text.length;
    let angleIncrement = 360 / numTextElements;
    for (let i = 0; i < numTextElements; i++) {
      let angle = i * angleIncrement + this.angle;
      let x = this.x + textRadius * cos(angle);
      let y = this.y + textRadius * sin(angle);
      textSize(20);
      textAlign(CENTER);
      text(this.text[i], x, y);
    }

    // Draw the circle
    stroke(0);
    noFill();
    ellipse(this.x, this.y, this.size);

    // Rotate the circle if the mouse is pressed on the circle
    if (this.mouseIsOver()) {
      if (mouseIsPressed) {
        let mouseAngle = atan2(mouseY - this.y, mouseX - this.x);
        this.angle = -mouseAngle;
      }
    } else {
      this.angle += rotationSpeed;
    }
  }

  mouseIsOver() {
    // Check if the mouse is over the circle
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    // Set the text of each circle to the input value
    circle1.text = textInput1.value().split('');
    circle2.text = textInput2.value().split('');
    circle3.text = textInput3.value().split('');
  }
}
