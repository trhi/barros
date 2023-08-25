// https://asia.siggraph.org/2023/submissions/art-papers/art-papers-author-manuscript-guidelines/
// https://icgj23.gameconf.org/call-for-papers


let rotation, clicked, center, angle, rotating=false, counter = 0, barrosText, textDiv, slogansDiv;

function preload() {}

function setup() {

  rotation = 0;
  center = createVector(520, 520);

  //let stopRotating = createButton("⏯️"); //  ⏯️   ⟳
  let toggleRotation = createImg("assets/img/autoplay-true.jpg");
  toggleRotation.id("rotatebutton");
  toggleRotation.mousePressed( toggleRotating );
}


function toggleRotating (){
  if ( rotating ){
    rotating = !rotating;
  } else {
    rotating = !rotating;
  }
}

function draw() {
   //background(204);
   if(rotating){
     counter++;
     angle = counter * 0.1;
     rotateMe(520,520,20*angle);
     rotateMe(520+80,520+80,-10*angle);
     rotateMe(520+140,520+140,10*angle);
     //rotateMe(520+230,520+230,-3*angle);
   }
}

function rotateMe(x,y, angle) {
  //console.log(event.pageX, event.pageY);
  let mouse = createVector (x,y);
  let dist = mouse.dist(center);

  if (dist < 80){
    rotateImage2('pointer', angle);
  } else if ( 100 < dist && dist < 170){
    rotateImage2('tab4', angle);
  } else if ( 170 < dist && dist < 220){
    rotateImage2('tab3', angle);
  } else if ( 220 < dist && dist < 360){
    rotateImage2('tab2', angle);
  } else if ( 360 < dist && dist < 510){
    //rotateImage('tab1');
  }
}

//this doesn't work because pointer is the image "on top" of all the other images
//and for this reason every time we click, clicks are only associated to id=pointer
//THEREFORE, must do this as: check how far away from center of image the clicks
//are happening, and rotate the tab that is x away from center..
function rotateImage2(id, angle) {
  clicked = document.getElementById(id);
  // Rotate image by 90 degrees clockwise
  clicked.style.transform = `rotate(${angle}deg)`;
}
