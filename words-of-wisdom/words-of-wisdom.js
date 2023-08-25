let listener, language = 'en', desktop = true;//desktop: user screen size
let isSpeechRecognitionSupported = false; //false until proven true
let phrases, wisdomsDIV, speakButton;
let degreeOfWisdom = 0, scoreColor;

let canvas, heartButton, speakingToMyHeart, infoButton, finnishButton, englishButton, infinityButton, url, thoughts;
let keywords = [], structure = [];
let infinity;

//var a = [], i = [], q = [], structures = [];

//continuous + press to speak would be better,
//but it is only possible on desktop (not on touch screen)
//solution:
//if user screen is <900px: continuous = false
//if user screen is >900px: continuous = true

//TODO: a floating speak/microphone button: "I want to speak wise words"

function fillPageWithWisdom() {
  //console.log("wisdoms have been loaded into variable wisdoms", phrases);
  //this function takes the wisdoms array and creates a visible list of wisdoms on the page
  wisdomsDIV = document.getElementById("wisdomSentences");

  for(let i=0; i<phrases.virtues.length; i++){//the
    let title = createP(phrases.virtues[i].title);
    title.id(phrases.virtues[i].title);
    title.class('title');
    title.parent(wisdomsDIV);
    for(let j=0; j<phrases.virtues[i].sentences.length;j++){
      let p = createP(phrases.virtues[i].sentences[j]);
      p.id(phrases.virtues[i].title+j);
      p.class('virtueSentences');
      p.parent(wisdomsDIV);
    }
  }

}

function preload() {

  phrases = loadJSON('assets/txt/words-of-wisdom.json', fillPageWithWisdom );
  //see if the user has speech recognition:
  try {
    //disable all of this if window doesn't have webkitSpeechRecognition or SpeechRecognition
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    listener = new SpeechRecognition;
    isSpeechRecognitionSupported = true;
  } catch (err) {
    //console.log("Speech recognition is not supported");
    window.alert("Please view this work in Chrome");
  }

  if (isSpeechRecognitionSupported){
        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        listener = new SpeechRecognition;
        listener.lang = 'en-EN'; //set to Finnish by default
        listener.interimResults = true;
        listener.continuous = true;//do logic here for if user is on mobile device or not

        listener.onresult = (event) => {
          speakingToMyHeart = event.results[0][0].transcript;
          //display transcript on screen:
          $("#questions").html('" <em>' + speakingToMyHeart.toLowerCase() + '<em>"');
          if(event.results[0].isFinal){
            //once the user has spoken, see if they spoke one of the wise virtuous sentences:
            didTheySpeakWiseWords(speakingToMyHeart.toLowerCase());
            stopAndClear();
          }
        }
    }//end if(isSpeechRecognitionSupported)
}//end preload()

function setup(){

  if (isSpeechRecognitionSupported){
    doInterface();
  }

} //close setup

function doInterface() {

  //remove since we are not doing anything with it?
  //or place behind text and make something interesting happen on it?
  canvas = createCanvas(0, 0);
  canvas.style('display', 'block');
  canvas.id('canvas');
  background("transparent");

  //infoButton to display instructions on how to use the piece:
  infoButton = createButton('i');
  infoButton.addClass('infobutton');

  infoButton.mouseOver( () => {
      if(language == 'fi'){
        $("#instructions-fi").show();
      } else if (language == 'en'){
        $("#instructions-en").show();
      }
    })
  .mouseOut( () => {
    $('#instructions-fi').hide();
    $("#instructions-en").hide();
    });

  heartButton = createImg('assets/images/h-ear-t.png');
  heartButton.parent('heartDIV');
  heartButton.style("visibility: hidden");
  heartButton.addClass('h-ear-tButton');
  heartButton.mousePressed( () => listenToMyHeart() )
  .mouseReleased( () => stopAndClear() )
  .mouseMoved( () => stopAndClear() )
  .mouseOut( () => stopAndClear() );

  scoreDiv = createDiv();
  scoreDiv.id('score-box');
  score = createP();
  score.id('score'); // for mapping between button and passportMode
  score.parent(scoreDiv);
  $('#score').text(degreeOfWisdom + " / 117");

  speakButton = createButton('🗣');
  speakButton.parent('heartDIV');
  speakButton.style("visibility: visible");
  speakButton.id('speakButton');
  speakButton.mousePressed( () => listenToMyHeart() )
  .mouseReleased( () => stopAndClear() )
  .mouseMoved( () => stopAndClear() )
  .mouseOut( () => stopAndClear() );
}

function stopAndClear(){
  $("#questions").css('opacity', '0.3');
  heartButton.attribute('src', 'assets/images/h-ear-t.png')
  listener.stop();
}

function listenToMyHeart() { //activated once person presses the h-ear-t:
  $("#answers").stop(true, true).empty().hide();
  $("#questions").show();
  $("#questions").text('');
  $("#questions").css('opacity', '1');
  $("#questions").text('" 🎤  "'); // 🗣️  🎤
  heartButton.attribute('src', 'assets/images/h-ear-t.gif');
  listener.start();
}

function didTheySpeakWiseWords(whatTheySpoke){

    for(let i=0; i<phrases.virtues.length; i++){//go through the virtue/titles first:
      for(let j=0; j<phrases.virtues[i].sentences.length;j++){
        //console.log("what they asked is:", whatTheySpoke);
        //console.log("testing for this phrase:", phrases.virtues[i].sentences[j]);
        if ( whatTheySpoke.localeCompare( phrases.virtues[i].sentences[j] ) == 0 ){
          //console.log("there is a match:", whatTheySpoke, "matches this sentece:", phrases.virtues[i].sentences[j] );
          document.getElementById(phrases.virtues[i].title+[j]).style.color = "pink";
          degreeOfWisdom++;
          scoreColor = degreeOfWisdom/177;
          $('#score').text(degreeOfWisdom + " / 117");
          $('#score-box').css('background-color',  `rgba(255 192 203 / ${scoreColor})` );
          phrases.virtues[i].sentences[j] = "wisdom has spoken";
          //replace sentence with: wisdom has spoken just so that they cannot
          //"play" this sentence again to increase their score
          j=phrases.virtues[i].sentences.length;
          i=phrases.virtues.length;
        }
      }
    }
}//close didTheySpeakWiseWords

function draw(){
  //oops, didn't make any use of this... BUT preload() was useful! as are
  //other p5.js methods, such as random()
  //this is me, cherrypicking from HTML5, p5.js and jquery :D
}
