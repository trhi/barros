// https://greensock.com/forums/topic/22549-how-to-drag-and-rotate-a-image-smoothly-using-draggable-rotation-feature/
// https://shopify.github.io/draggable/

// https://asia.siggraph.org/2023/submissions/art-papers/art-papers-author-manuscript-guidelines/
// https://icgj23.gameconf.org/call-for-papers


/*
.gameboard{
  top: 0;
  left: 0;
  margin: auto;
  height: auto;
  width: auto;
}

.boardelements{
  display:block;
}



*/

let rotation, clicked, center, angle, rotating=true, counter = 0, barrosText, textDiv, slogansDiv;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;

function preload() {
  barrosText = loadJSON("assets/texts/texts.json", printTexts);
  textDiv = document.getElementById("book");

  slogansDiv = document.getElementById("virtueSlogans");

}

function setup() {

  rotation = 0;
  center = createVector(520, 520);
  console.log(center);
  document.addEventListener("click", (e) => rotateVolvelles(e) );
  //createCanvas(1000,1000);

  let stopRotating = createButton("⏯️"); //  ⏯️   ⟳
  stopRotating.id("rotatebutton");
  stopRotating.mousePressed( toggleRotating );

}

function printTexts(){
  console.log("running function");
  for (let i=0;i<barrosText.text.length;i++){
    let p = createP(barrosText.text[i].barros);
    p.id(i);
    p.class("changingText");
    p.mouseClicked(toggleTexts);
    p.parent(textDiv);
    //textDiv.child(p);
  }

  for (let i=0;i<barrosText.virtues[i].length;i++){
    for (let j=0; j<barrosText.virtues[i].slogans[j]; j++){
      let p = createP(barrosText.virtues[i].slogans[j]);
      p.id("v"+i+"s"+j);
      //p.class("changingText");
      p.mouseClicked(readOutLoud);
      p.parent(slogansDiv);
      //textDiv.child(p);
    }
  }

}

function toggleTexts(){
  let textcolor = this.style('color');
  if( textcolor == 'rgb(255, 20, 147)' ){
    this.html( barrosText.text[this.id()].barros );
    this.style('color', 'black');
  } else {
    this.html( barrosText.text[this.id()].simple );
    this.style('color', 'deeppink');
    //this.style("font-style: italic;");
  }
}

function readOutLoud(){
  console.log("yuippe!!");
  //console.log("yuippe!! and my id is:", this.id() );

  recognition.start();
  console.log("Ready to receive a color command.");

}

recognition.onresult = (event) => {
const color = event.results[0][0].transcript;
diagnostic.textContent = `Result received: ${color}`;
bg.style.backgroundColor = color;
};

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
     rotateMe(520,520,5*angle);
     rotateMe(520+80,520+80,-angle);
     rotateMe(520+140,520+140,-8*angle);
     rotateMe(520+230,520+230,-3*angle);
   }
}

function speak(text){
  console.log("this is what I saw:", text);
}

/*
const delta = 6;
let startX;
let startY;

document.addEventListener('mousedown', function (event) {
  startX = event.pageX;
  startY = event.pageY;
});

document.addEventListener('mouseup', function (event) {
  const diffX = Math.abs(event.pageX - startX);
  const diffY = Math.abs(event.pageY - startY);

  if (diffX < delta && diffY < delta) {
    // Click!
  } else {
    let mouse = createVector (event.pageX, event.pageY);
    let dist = mouse.dist(center);

    if (dist < 80){
      rotateImage('pointer');
    } else if ( 100 < dist && dist < 170){
      rotateImage('tab4');
    } else if ( 170 < dist && dist < 220){
      rotateImage('tab3');
    } else if ( 220 < dist && dist < 360){
      rotateImage('tab2');
    } else if ( 360 < dist && dist < 510){
      //rotateImage('tab1');
    }


  }
});

*/


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

  //if ( event.pageX < 611 && )

  //rotate(element);

}


function rotateVolvelles(event) {
  //console.log(event.pageX, event.pageY);

  let mouse = createVector (event.pageX, event.pageY);
  let dist = mouse.dist(center);

  if (dist < 80){
    rotateImage('pointer');
  } else if ( 100 < dist && dist < 170){
    rotateImage('tab4');
  } else if ( 170 < dist && dist < 220){
    rotateImage('tab3');
  } else if ( 220 < dist && dist < 360){
    rotateImage('tab2');
  } else if ( 360 < dist && dist < 510){
    //rotateImage('tab1');
  }

  //if ( event.pageX < 611 && )

  //rotate(element);

}

//this doesn't work because pointer is the image "on top" of all the other images
//and for this reason every time we click, clicks are only associated to id=pointer
//THEREFORE, must do this as: check how far away from center of image the clicks
//are happening, and rotate the tab that is x away from center..
function rotateImage(id) {
  clicked = document.getElementById(id);

  if (id == "pointer"){
    rotation += 5;
  } else {
    rotation += 15;
  }
  if (rotation == 360){
    rotation = 0;
  }

  // Rotate image by 90 degrees clockwise
  clicked.style.transform = `rotate(${rotation}deg)`;
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
