function setup() {
    createCanvas(600, 1200);
}

function drawDebug(x, y, radius) {
    drawingContext.setLineDash([5, 3]);
    noFill()
    stroke('cyan')
    circle(x, y, 2*radius)

    fill('grey')
    circle(x, y, 4)



      drawingContext.setLineDash([]);

}

function rotateText(x, y, radius, txt, angle) {
    // Comment the following line to hide debug objects
    drawDebug(x, y, radius)

    // Split the chars so they can be printed one by one
    chars = txt.split("")

    // Decide an angle
    //charSpacingAngleDeg = 4;

    // https://p5js.org/reference/#/p5/textAlign
    textAlign(CENTER, BASELINE)
    textSize(15)
    fill('black')

    // https://p5js.org/reference/#/p5/push
    // Save the current translation matrix so it can be reset
    // before the end of the function
    push()

    // Let's first move to the center of the circle
    translate(x, y)

    // First rotate half back so that middle char will come in the center
    rotate(radians(-chars.length * angle / 2))

    for (let i = 0; i < chars.length; i++) {
        text(chars[i], 0, -radius)

        // Then keep rotating forward per character
        rotate(radians(angle))
    }

    // Reset all translations we did since the last push() call
    // so anything we draw after this isn't affected
    pop()

}

function draw() {
    background('pink');

    //textToRotate = "HELLO WORLD this is a first attempt at a volvelle"


    //we are basically saying:
    //center of circle is at 300, 300
    //then radius until that volvelle is r= 200, 150, 100, 50, etc...

    rotateText(300, 300, 200, "gloomy ✧ rainy ✧ cloudy ✧ stormy ✧ dark ✧ enchanted ✧ light ✧ dancing ✧ swirling ✧ tripping ✧ hungry ✧ tired ✧ manic ✧  ", 3)
    rotateText(300, 300, 150, "day ● night ● house ● sky ● morning ● evening ● star ● cat ● hat ● plant ● trap ● door ● car ● ship ●", 3.5)
  rotateText(300, 300, 100, "cried ♡ stole ♡ ate ♡ saw ♡ drew ♡ thought ♡ spat ♡ drank ♡ ran ♡ fumbled ♡ lost ♡ put ♡", 4)
    rotateText(300, 300, 50, "tears ○ hearts ○ trees ○ shells ○ stones ○", 8)

    let mousePosition = createVector(mouseX, mouseY);
    let epicenter = createVector(300, 300);



    if( 49 < epicenter.dist(mousePosition) && epicenter.dist(mousePosition) < 55 ){
      console.log("Mouse is at the first volvelle!")
    }

    if( 99 < epicenter.dist(mousePosition) && epicenter.dist(mousePosition) < 105 ){
      console.log("Mouse is at the second volvelle!")
    }

    if( 149 < epicenter.dist(mousePosition) && epicenter.dist(mousePosition) < 155 ){
      console.log("Mouse is at the third volvelle!")
    }

    if( 199 < epicenter.dist(mousePosition) && epicenter.dist(mousePosition) < 205 ){
      console.log("Mouse is at the fourth volvelle!")
    }


    //first draft of text:

    rotateText(300, 800, 200, "The very outer most gigantic volvelle text", 3)
    rotateText(300, 800, 150, "HELLO WORLD this is a first attempt at a volvelle", 3.5)
  rotateText(300, 800, 100, "second text for volvelle", 4)
    rotateText(300, 800, 50, "inner circle text for volvelle", 6)

}
