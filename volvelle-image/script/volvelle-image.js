let userVolvelles = [];
let userVolvelleArray = [1, 0.75, 0.5, 0.23];
let exampleVolvelles = [
	["img/TABall-low-1.png", [1, 0.58, 0.47] ],
	['img/simoes-img-2.png', [1, 0.83, 0.66, 0.49] ],
	['img/simoes-img-3.png', [1, 0.429] ],
	['img/simoes-img-4.png', [1, 0.629, 0.44] ],
	['img/simoes-img-5.jpg', [1, 0.629, 0.38] ],
	['img/simoes-img-6.jpg', [1, 0.629, 0.44] ],
	['img/simoes-img-7.jpg', [1, 0.8, 0.629, 0.44] ],
	['img/simoes-words-2-L.png', [1, 0.85, 0.683, 0.525, 0.374] ],
	['img/simoes-words-3-L.png', [1, 0.84, 0.683, 0.525, 0.374] ]
];
let puzzleDiv = document.getElementById("puzzle-canvas-wrapper");

//add this in order to make it valid p5.js:
function setup(){};

//we do not necessarily need to be doing anything here,
//OR we can go through the array of puzzle canvases and call
//this.draw() on all of them at every draw cycle:
function draw(){};

/**
 * @namespace Contains all of the core Puzzle classes
 */
var PUZZLE = {};

/**
 * Creates a new Puzzle Controller
 * @class	Controls all of the Puzzle logic and handles all of the Puzzle events
 * @param	{PuzzleCanvas}	puzzleCanvas	Puzzle canvas used to display Puzzle
 * @param	{Image}			image			Image used within the Puzzle
 * @param	{Number}		numCircles		Number of concentric circles in Puzzle
 */
PUZZLE.PuzzleController = function(puzzleCanvas, image, volvellePercentages) {
	// Constants
	var FULL_ROTATION = (Math.PI * 2);
	var ROTATION_SPEED = 50;

	// Properties
	this.puzzleCanvas = puzzleCanvas;
	this.isDragging = false;
	this.activeCircle = null;
	this.circles = [];
	numCircles = volvellePercentages.length;
	//numCircles: number of circles is equal to the number of parameters
	//we pass in the array that defines the cutpoint for the circles (as percentage
	//of radius)

	// Get canvas dimensions
	var canvasWidth = puzzleCanvas.getWidth();
	var canvasHeight = puzzleCanvas.getHeight();

	// Get image dimensions
	var imageWidth = image.width;
	var imageHeight = image.height;

	// Use the smallest possible radius to ensure image fits
	var maxRadius = Math.min(canvasWidth, canvasHeight, imageWidth, imageHeight)/2;
	//here we calculate maxRadius, ie. the maximum radius of the circular image,
	// ie: width/2.

	// Calculate Puzzle Circle dimensions
	var centerX = canvasWidth/2;
	var centerY = canvasHeight/2;

	// here we are basically saying, how many volvelles there will be, eg. numCircles = 4,
	// so radiusDiff = length of radius between them, which in this code is
	// assumed to **always be equal**.
	// For our volvelles code, we (may) want this number
	// to (always?) be different..:
	var radiusDiff = (maxRadius/numCircles);
	// so eg. for a maxRadius = 100 and numCircles = 5, radiusDiff will be 20 (that is: 20 pixels per circle)
	//we end up not using this variable radiusDiff, we instead give the "radius difference"
	//as volvelle percentages

	//here we have to be able to give numCircles as an array of values that splits
	//the image as % of radius from center:

	//THIS is where the central mathematics happens!

	// Create the Puzzle Circles
	var currRadius = maxRadius; // so eg. we start with maxRadius = currRadius = 100:
	for(var i=0; i<numCircles; i++) // so then we go through i=0 until numCircles = 5:
	{

		var rotation = random() * FULL_ROTATION; //add a random rotation to the each circle of the image:
		//this.circles[i] = new PUZZLE.PuzzleCircle(centerX, centerY, currRadius, image, rotation);

		this.circles[i] = new PUZZLE.PuzzleCircle(centerX, centerY, maxRadius*volvellePercentages[i], image, rotation);


		// this creates a new PuzzleCircle given the centerX and centerY which are constant,
		// the image, which is constant, and a randomly generated rotation, which
		// essentially shifts the image by a specific amount in order to make it
		// into a puzzle.
		// what it basically does is that it draws a puzzle circle, largest to smallest,
		// center to that radius, then pops it into an array by index: the first element
		// is the largest, the second the second largest, etc.

		//omit this original code that cuts the image up according to equal/uniform portions:
		//currRadius -= radiusDiff;
	}

	// Display the Puzzle Circles
	this.draw(); //draw the puzzle canvas, which then calls draw puzzle circles.

	// ^^ i guess here it somehow draws the puzzle circles on top of eachother?

	var self = this; //why this?

	// Event Handler: On Mouse Down
	//so when a mousedown event happens on top of the canvas element:
	//puzzleCanvas.canvas.addEventListener('mousedown', function(event) { //was mousedown
	puzzleCanvas.canvas.addEventListener('mousedown', function(event) {
		event.preventDefault();
		var cursorPos = self.puzzleCanvas.getCursorPosition(event);

		// Determine the circle that the User clicked
		for(var i=self.circles.length - 1; i>=0; i--)
		{
			if(self.circles[i].isInside(cursorPos.x, cursorPos.y))
			//this checks if mouse click happened on top of "me"
			{
				self.activeCircle = self.circles[i]; //check which is the activeCircle, ie. which circle was touched -> rotated
				self.isDragging = true;
				return;
			}
		}
	}, false);

	var lastCursorX = null;

	// Event Handler: On Mouse Up
	//puzzleCanvas.canvas.addEventListener('mouseup', function(event) {
	puzzleCanvas.canvas.addEventListener('mouseup', function(event) {
		event.preventDefault();
		// Reset the dragging state
		self.isDragging = false;
		lastCursorX = null;
	}, false);

	// Event Handler: On Mouse Move
	//puzzleCanvas.canvas.addEventListener('mousemove', function(event) {
	puzzleCanvas.canvas.addEventListener('mousemove', function(event) {
		event.preventDefault();

		if(!self.isDragging)
		{
			return;
		}

		var cursorPos = self.puzzleCanvas.getCursorPosition(event);
		var cursorX = cursorPos.x;
		var cursorY = cursorPos.y;

		// First Mouse Move since Mouse Down, so just the cache cursor position and leave
		if(lastCursorX == null)
		{
			lastCursorX = cursorX;
			return;
		}

		// Calculate rotation distance
		var cursorXDiff = cursorX - lastCursorX;
		var rotation = -(cursorXDiff/ROTATION_SPEED);

		// If we're on the upper half of the circle, then we need to do the inverse calculation
		// of the rotation
		if(cursorY < self.activeCircle.y)
		{
			rotation = (FULL_ROTATION) - rotation;
		}

		self.rotateCircle(self.activeCircle, rotation);

		// Cache the cursor position
		lastCursorX = cursorX;
	}, false);





// Event Handler: On Mouse Down
//so when a mousedown event happens on top of the canvas element:
//puzzleCanvas.canvas.addEventListener('mousedown', function(event) { //was mousedown
puzzleCanvas.canvas.addEventListener('touchstart', function(event) {
	event.preventDefault();
	var cursorPos = self.puzzleCanvas.getCursorPosition(event);

	// Determine the circle that the User clicked
	for(var i=self.circles.length - 1; i>=0; i--)
	{
		if(self.circles[i].isInside(cursorPos.x, cursorPos.y))
		//this checks if mouse click happened on top of "me"
		{
			self.activeCircle = self.circles[i]; //check which is the activeCircle, ie. which circle was touched -> rotated
			self.isDragging = true;
			return;
		}
	}
}, false);

var lastCursorX = null;

// Event Handler: On Mouse Up
//puzzleCanvas.canvas.addEventListener('mouseup', function(event) {
puzzleCanvas.canvas.addEventListener('touchend', function(event) {
	event.preventDefault();
	// Reset the dragging state
	self.isDragging = false;
	lastCursorX = null;
}, false);

// Event Handler: On Mouse Move
//puzzleCanvas.canvas.addEventListener('mousemove', function(event) {
puzzleCanvas.canvas.addEventListener('touchmove', function(event) {
	event.preventDefault();

	if(!self.isDragging)
	{
		return;
	}

	var cursorPos = self.puzzleCanvas.getCursorPosition(event);
	var cursorX = cursorPos.x;
	var cursorY = cursorPos.y;

	// First Mouse Move since Mouse Down, so just the cache cursor position and leave
	if(lastCursorX == null)
	{
		lastCursorX = cursorX;
		return;
	}

	// Calculate rotation distance
	var cursorXDiff = cursorX - lastCursorX;
	var rotation = -(cursorXDiff/ROTATION_SPEED);

	// If we're on the upper half of the circle, then we need to do the inverse calculation
	// of the rotation
	if(cursorY < self.activeCircle.y)
	{
		rotation = (FULL_ROTATION) - rotation;
	}

	self.rotateCircle(self.activeCircle, rotation);

	// Cache the cursor position
	lastCursorX = cursorX;
}, false);
};




/**
 * Rotates a circle in the Puzzle
 * @param	{PuzzleCircle}	circle		Puzzle circle to rotate
 * @param	{Number}		rotation	Radians of rotation
 */

 //this function rotates just the circle
 //and then re/draws JUST THAT CIRCLE:
PUZZLE.PuzzleController.prototype.rotateCircle = function(circle, rotation) {
	circle.rotation += rotation; //rotates THAT circle,
	this.draw(); //and then "draws" the stuff on the canvas again, but JUST that circle:
};

/**
 * Draws the Puzzle on the canvas
 */
PUZZLE.PuzzleController.prototype.draw = function() {
	this.puzzleCanvas.clear(); //this is the PUZZLE's own draw() method:
	//it clears each of the puzzle circles,
	//and then draws them again:

	for(var i=0; i<this.circles.length; i++)
	{
		var circle = this.circles[i];
		this.puzzleCanvas.drawPuzzleCircle(circle);
	}
};

/**
 * Creates a new Puzzle Circle
 * @class	A circle within the Puzzle
 * @param	{Number}	x			Center X-coordinate
 * @param	{Number}	y			Center Y-coordinate
 * @param	{Number}	radius		Radius of circle
 * @param	{Number}	image		Image displayed within circle
 * @param	{Number}	rotation	Radian rotation of Circle
 */
PUZZLE.PuzzleCircle = function(x, y, radius, image, rotation) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.image = image;
	this.rotation = rotation;
};

/**
 * Checks if coordinates are within the boundaries of a circle
 * @param	{Number}	x	X-coordinate
 * @param	{Number}	y	Y-coordinate
 */
PUZZLE.PuzzleCircle.prototype.isInside = function (x, y) {
	var xDist = this.x - x;
	var yDist = this.y - y;

	return ((xDist * xDist) + (yDist * yDist)) < (this.radius * this.radius);
};


//This is saying that the puzzle canvas == the canvas element created:
//the question is: what is then different about the PuzzleCanvas -
//what does it add to canvas? if anything?
/**
 * Creates a new Puzzle Canvas
 * @class	A canvas displaying a Puzzle
 * @param	{DOM}	Canvas element
 */
PUZZLE.PuzzleCanvas = function(canvas) {
	this.canvas = canvas;
	this.gfxContext = canvas.getContext('2d');
};


//these methods essentially just get the height and width of the canvas element:
/**
 * Returns the width of the canvas
 * @return	{Number}	Width of the canvas
 */
PUZZLE.PuzzleCanvas.prototype.getWidth = function() {
	return this.canvas.width;
};

/**
 * Returns the height of the canvas
 * @return	{Number}	Height of the canvas
 */
PUZZLE.PuzzleCanvas.prototype.getHeight = function() {
	return this.canvas.height;
};

/**
 * Returns the X, Y coordinates of the User's cursor, within the Canvas
 * @param	{Event}		event	Mouse event
 * @return	{Object}	User's cursor position as an object map with "x" and "y" properties
 */
PUZZLE.PuzzleCanvas.prototype.getCursorPosition = function(event) {
	var cursorPos = UTIL.getCursorPosition(event); //just getting the x and y - but is it relative to the canvas?
	cursorPos.x -= this.canvas.offsetLeft; //YES!, it is getting the relative cursor position,
	cursorPos.y -= this.canvas.offsetTop; //because here it adds an offset for the canvas position (left and top)
	return cursorPos; //in other words: if implemented in p5.js, and there is only one canvas
	//allowd, then this relative x and y are already processed in mouseX and mouseY.
};

/**
 * Clears the canvas
 */
PUZZLE.PuzzleCanvas.prototype.clear = function() { //this is also the same as clear() in p5.js
	var canvasWidth = this.getWidth();
	var canvasHeight = this.getHeight();

	var context = this.gfxContext;

	context.globalCompositeOperation = 'destination-over';
	context.clearRect(0, 0, canvasWidth, canvasHeight);
};

/**
 * Draws a Puzzle Circle
 * @param	puzzleCircle
 */
 //this just draws each of the puzzleCircles in order, and adds the rotation
 //that is attributed to each one of them:
 //
PUZZLE.PuzzleCanvas.prototype.drawPuzzleCircle = function(puzzleCircle) {
	var context = this.gfxContext; //this is the own draw() method for the canvas:
	//for the puzzle circles, which are each drawn separately:

	// Start composition
	context.save();

	context.globalCompositeOperation = 'source-over';

	// Move canvas to center or Circle to simplify rotation
	context.translate(puzzleCircle.x, puzzleCircle.y);
	context.rotate(puzzleCircle.rotation);

	// Draw the circle
	context.beginPath();
	context.arc(0, 0, puzzleCircle.radius, 0, Math.PI * 2, false);
	context.clip();

	// Draw the image
	context.drawImage(puzzleCircle.image,
		-(puzzleCircle.image.width/2),
		-(puzzleCircle.image.height/2));

	// End composition
	context.restore();
};

/**
 * @namespace Contains utility functions
 */
var UTIL = {};

//this function is just asking for cursorPosition, and considering
//that the user may have scrolled left/right on the body or element, or top/bottom.
/**
 * Returns the X, Y coordinates of the User's cursor, within the browser window
 * @param	{Event}		event	Mouse event
 * @return	{Object}	User's cursor position as an object map with "x" and "y" properties
 * CREDIT: http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/
 */
UTIL.getCursorPosition = function(event) {
	var x;
	var y;

	if (event.pageX || event.pageY)
	{
		x = event.pageX;
		y = event.pageY;
	}
	else
	{
		x = event.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
	}

	return { 'x': x, 'y': y };
};


/*

MY ADDITIONS BEGIN HERE:

*/

//create a scaled down version of the image and then create the volvelle:

// this function allows users to upload their own image (square, centered)
// to create a digital volvelle that they can move:
document.getElementById("uploadButton").addEventListener("change", function(e) {

						var img = document.createElement('img');
            img.src = URL.createObjectURL(e.target.files[0]);

						img.onload = function() {

            // Create a canvas element
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Set the maximum width to 600 pixels
            var maxWidth = 600;

            // Calculate the scaled-down dimensions
            var width = img.width;
            var height = img.height;
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }

            // Set the canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw the image on the canvas with scaled dimensions
            ctx.drawImage(img, 0, 0, width, height);

            // Get the scaled-down image data URL
            var scaledDataUrl = canvas.toDataURL();

            // Display the scaled-down image on the page
            var scaledImg = document.createElement('img');
            scaledImg.src = scaledDataUrl;
            //document.getElementById('puzzle-canvas-wrapper').appendChild(scaledImg);

						scaledImg.onload = function () {

							let myCanvas = document.createElement("canvas");
							myCanvas.width = 800;
							myCanvas.height = 800;

							puzzleDiv.appendChild(myCanvas);
							let userCanvas = new PUZZLE.PuzzleCanvas(myCanvas);
							let userPuzzle = new PUZZLE.PuzzleController(userCanvas, scaledImg, userVolvelleArray);

						}
}
});


//populate page with all the volvelles in the array:
// Launch the Puzzle when the DOM is ready
window.addEventListener('load', function () {

	//takes an array of: src and volvelle cutoff array -pairs
	//and creates new canvas and puzzle canvas for each:
	for( let i=0; i < exampleVolvelles.length; i++){

		let array = exampleVolvelles[i][1];
		let puzzleImage = new Image();
		puzzleImage.src = exampleVolvelles[i][0];

		puzzleImage.onload = function() {
			let canvas = document.createElement('canvas');
			canvas.id = "puzzle-canvas-"+i;
			canvas.width = 800;
			canvas.height = 800;
			puzzleDiv.appendChild(canvas);
			let puzzleCanvas = new PUZZLE.PuzzleCanvas(canvas);
			let puzzle = new PUZZLE.PuzzleController(puzzleCanvas, puzzleImage, array);
		};
	}
}, false);
