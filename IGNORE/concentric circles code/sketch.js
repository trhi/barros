let firstCircle;

function setup() {
  createCanvas(400, 400);
  
  firstCircle = {
    r:50,
    text:"me",
    textPos:-10
  };
  
  secondCircle = {
    r:150,
    text:"you",
    textPos:35
  };
  
  thirdCircle = {
    r:250,
    text:"they",
    textPos:80
  };
  
  fourthCircle = {
    r:350,
    text:"we",
    textPos:140
  };
  
}

function draw() {
  background(220);
  translate(width/2, height/2);
  
  //what you would need is an if statement that checks
//whether a text element has been grabbed (touchdown and touchdrag)
  //if it has, you would then do a rotation on the text element around the center translating the x and y movement of the mouse to degrees of rotation.
  //in other words, you could just rotate the text, not the image / the concentric / the arc
  //or you could rotate the entire arc / circle / image
  
  
  
  drawCircles();
  //separate draw text method?
  //how to draw the text on an arc?
  
  
  
}

function drawCircles(){
    
  ellipse(0, 0, fourthCircle.r, fourthCircle.r);
  text(fourthCircle.text, fourthCircle.textPos, 0);
  
  ellipse(0, 0, thirdCircle.r, thirdCircle.r);
  text(thirdCircle.text, thirdCircle.textPos, 0);
  
  ellipse(0, 0, secondCircle.r, secondCircle.r);
  text(secondCircle.text, secondCircle.textPos, 0);

  ellipse(0, 0, firstCircle.r, firstCircle.r);
  text(firstCircle.text, firstCircle.textPos, 0);
 
  
}
