let barrosText, textDiv;

function preload() {
  barrosText = loadJSON("assets/texts/texts.json", printTexts);
  textDiv = document.getElementById("book");
}

function setup() {}

function printTexts(){
  console.log("running function");
  for (let i=0;i<barrosText.text.length;i++){
    let p = createP(barrosText.text[i].barros);
    p.id(i);
    p.class("changingText");
    p.mouseClicked(toggleTexts);
    p.parent(textDiv);
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

function draw() {}
//again, not using this at all, but using p5.js functions.
