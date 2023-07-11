let userVolvelles = [];
let userVolvelleArray = [1, 0.75, 0.5, 0.23];
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
PUZZLE.PuzzleController = function(puzzleCanvas, image, numCircles, volvellePercentages) {
	// Constants
	var FULL_ROTATION = (Math.PI * 2);
	var ROTATION_SPEED = 50;

	// Properties
	this.puzzleCanvas = puzzleCanvas;
	this.isDragging = false;
	this.activeCircle = null;
	this.circles = [];

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

	//here we have to be able to give numCircles as an array of values that splits
	//the image as % of radius from center:

	//THIS is where the central mathematics happens!

	// Create the Puzzle Circles
	var currRadius = maxRadius; // so eg. we start with maxRadius = currRadius = 100:
	for(var i=0; i<numCircles; i++) // so then we go through i=0 until numCircles = 5:
	{
		var rotation = Math.random() * FULL_ROTATION;
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
	this.draw();

	// ^^ i guess here it somehow draws the puzzle circles on top of eachother?

	var self = this;

	// Event Handler: On Mouse Down
	puzzleCanvas.canvas.addEventListener('mousedown', function(event) {
		var cursorPos = self.puzzleCanvas.getCursorPosition(event);

		// Determine the circle that the User clicked
		for(var i=self.circles.length - 1; i>=0; i--)
		{
			if(self.circles[i].isInside(cursorPos.x, cursorPos.y))
			//this checks if mouse click happened on top of "me"
			{
				self.activeCircle = self.circles[i];
				self.isDragging = true;
				return;
			}
		}
	}, false);

	var lastCursorX = null;

	// Event Handler: On Mouse Up
	puzzleCanvas.canvas.addEventListener('mouseup', function(event) {
		// Reset the dragging state
		self.isDragging = false;
		lastCursorX = null;
	}, false);

	// Event Handler: On Mouse Move
	puzzleCanvas.canvas.addEventListener('mousemove', function(event) {
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
PUZZLE.PuzzleController.prototype.rotateCircle = function(circle, rotation) {
	circle.rotation += rotation;
	this.draw();
};

/**
 * Draws the Puzzle on the canvas
 */
PUZZLE.PuzzleController.prototype.draw = function() {
	this.puzzleCanvas.clear();

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

/**
 * Creates a new Puzzle Canvas
 * @class	A canvas displaying a Puzzle
 * @param	{DOM}	Canvas element
 */
PUZZLE.PuzzleCanvas = function(canvas) {
	this.canvas = canvas;
	this.gfxContext = canvas.getContext('2d');
};

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
	var cursorPos = UTIL.getCursorPosition(event);
	cursorPos.x -= this.canvas.offsetLeft;
	cursorPos.y -= this.canvas.offsetTop;
	return cursorPos;
};

/**
 * Clears the canvas
 */
PUZZLE.PuzzleCanvas.prototype.clear = function() {
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
PUZZLE.PuzzleCanvas.prototype.drawPuzzleCircle = function(puzzleCircle) {
	var context = this.gfxContext;

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

							document.getElementById("puzzle-canvas-wrapper").appendChild(myCanvas);

							let userCanvas = new PUZZLE.PuzzleCanvas(myCanvas);
							let userPuzzle = new PUZZLE.PuzzleController(userCanvas, scaledImg, userVolvelleArray.length, userVolvelleArray);

						}
}
});


// Launch the Puzzle when the DOM is ready
window.addEventListener('load', function () {

	//var volvellePercentages = [1, 0.80, 0.66, 0.5, 0.36]; //simoes-words-1.png
	//var volvellePercentages = [1, 0.79, 0.6, 0.42]; //simoes-img-1.png
	//var volvellePercentages = [1, 0.83, 0.66, 0.49]; //simoes-img-2.png
	//var volvellePercentages = [1, 0.58, 0.47]; //TABall-low-1.png

	var puzzleImage4 = new Image();
	puzzleImage4.onload = function() {
		var canvas4 = document.getElementById('puzzle-canvas-1');
		var puzzleCanvas4 = new PUZZLE.PuzzleCanvas(canvas4);
		var puzzle4 = new PUZZLE.PuzzleController(puzzleCanvas4, puzzleImage4, p4array.length, p4array); //this is the critical variable: numCircles
	};
	var p4array = [1, 0.58, 0.47];
	puzzleImage4.src = 'img/TABall-low-1.png';

	var puzzleImage1 = new Image();
	puzzleImage1.onload = function() {
		var canvas1 = document.getElementById('puzzle-canvas-4');
		var puzzleCanvas1 = new PUZZLE.PuzzleCanvas(canvas1);
		var puzzle1 = new PUZZLE.PuzzleController(puzzleCanvas1, puzzleImage1, p1array.length, p1array); //this is the critical variable: numCircles

	};
	var p1array = [1, 0.80, 0.66, 0.5, 0.36];
	puzzleImage1.src = 'img/simoes-words-1.png';

	//***

	var puzzleImage2 = new Image();
	puzzleImage2.onload = function() {
		var canvas2 = document.getElementById('puzzle-canvas-2');
		var puzzleCanvas2 = new PUZZLE.PuzzleCanvas(canvas2);
		var puzzle2 = new PUZZLE.PuzzleController(puzzleCanvas2, puzzleImage2, p1array.length, p2array); //this is the critical variable: numCircles
	};
	var p2array = [1, 0.79, 0.6, 0.42];
	puzzleImage2.src = 'img/simoes-img-1.png';

	var puzzleImage3 = new Image();
	puzzleImage3.onload = function() {
		var canvas3 = document.getElementById('puzzle-canvas-3');
		var puzzleCanvas3 = new PUZZLE.PuzzleCanvas(canvas3);
		var puzzle3 = new PUZZLE.PuzzleController(puzzleCanvas3, puzzleImage3, p3array.length, p3array); //this is the critical variable: numCircles
	};
	var p3array = [1, 0.83, 0.66, 0.49];
	puzzleImage3.src = 'img/simoes-img-2.png';

	var puzzleImage5 = new Image();
	puzzleImage5.onload = function() {
		var canvas5 = document.getElementById('puzzle-canvas-5');
		var puzzleCanvas5 = new PUZZLE.PuzzleCanvas(canvas5);
		var puzzle5 = new PUZZLE.PuzzleController(puzzleCanvas5, puzzleImage5, p5array.length, p5array); //this is the critical variable: numCircles
	};
	var p5array = [1, 0.429];
	puzzleImage5.src = 'img/simoes-img-3.png';

	var puzzleImage6 = new Image();
	puzzleImage6.onload = function() {
		var canvas6 = document.getElementById('puzzle-canvas-6');
		var puzzleCanvas6 = new PUZZLE.PuzzleCanvas(canvas6);
		var puzzle6 = new PUZZLE.PuzzleController(puzzleCanvas6, puzzleImage6, p6array.length, p6array); //this is the critical variable: numCircles
	};
	var p6array = [1, 0.629, 0.44];
	puzzleImage6.src = 'img/simoes-img-4.png';

	var puzzleImage7 = new Image();
	puzzleImage7.onload = function() {
		var canvas7 = document.getElementById('puzzle-canvas-7');
		var puzzleCanvas7 = new PUZZLE.PuzzleCanvas(canvas7);
		var puzzle7 = new PUZZLE.PuzzleController(puzzleCanvas7, puzzleImage7, p7array.length, p7array); //this is the critical variable: numCircles
	};
	var p7array = [1, 0.85, 0.683, 0.525, 0.374];
	puzzleImage7.src = 'img/simoes-words-2-L.png';

}, false);
