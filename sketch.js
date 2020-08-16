"use strict";

//declare all global variables
let cycloid;

let sliders;
let animationCheckbox;

let theme;
let assetTextFont;
let canvases;

let exampleGif;

function preload() {
    assetTextFont = loadFont("./assets/Roboto-Bold.ttf"); //loading a simple font
    exampleGif = loadImage("./generated-cycloid.gif");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    frameRate(120); //raising the max frameRate in order to allow for faster rendering
    textFont(assetTextFont, 16); //setting font as default, along with a comfortable font size
    smooth(); //turn on anti-aliasing

    // theme = {
    //     bgColor: color(221, 249, 193),
    //     fgColor: color(83, 153, 135),
    //     menuColor: color(205, 217, 244),
    //     textColor: color(100, 100, 100),
    // };

    theme = {
        bgColor: color(221, 249, 193),
        fgColor: color(83, 153, 135),
        menuColor: color(168, 218, 220),
        textColor: color(100, 100, 100),
    };

    //set defaults and initialize script
    angleMode(DEGREES);
    updateCanvasDimensions();
    setupInteractiveElements();
    updateRadiusSliderMax();
    start();
    showMenuTextAndImage();
}

//sets the size of the canvasat start of script and resizing of canvas
function updateCanvasDimensions() {
    canvases = {
        menuCanvas: {
            left: -windowWidth / 2,
            right: -windowWidth / 2 + 200,
            top: -windowHeight / 2,
            bottom: windowHeight / 2,
            width: 200,
            height: windowHeight,
        },
        drawingCanvas: {
            left: -windowWidth / 2 + 200,
            right: windowWidth / 2,
            top: -windowHeight / 2,
            bottom: windowHeight / 2,
            width: windowWidth - 200,
            height: windowHeight,
        },
    };
}

//create the cycloid and clear the background
function start() {
    cycloid = createCycloid();
    noFill();
    drawBackground();
}

//called when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight); //resize canvases to match window size
    updateCanvasDimensions(); //update the dimensions of the canvases
    updateRadiusSliderMax(); //update the max value of the radius slider
    start(); //restart the sketch with updated variables
    showMenuTextAndImage(); //show the interactive element text
}

// updates the max possible value of the radius slider when windo is resized
function updateRadiusSliderMax() {
    sliders[0].elt.max = min([
        500,
        canvases.drawingCanvas.width / 2 - 60,
        canvases.drawingCanvas.height / 2 - 60,
    ]).toString();
    //sets the max value of the radius slider to the smallest of three values-
    // (max allowed value), width of drawing canvas - padding space, height of drawing canvas - padding space
}

function draw() {
    drawBackground();
    push();
    translate(
        (canvases.drawingCanvas.left + canvases.drawingCanvas.right) / 2,
        (canvases.drawingCanvas.top + canvases.drawingCanvas.bottom) / 2
    );
    rotate(sliders[2].value());
    imageMode(CENTER);
    image(
        cycloid.drawCycloid(animationCheckbox),
        0,
        0,
        cycloid.graphics.width,
        cycloid.graphics.height
    );
    pop();
    drawBackgroundMenu();
    drawBackgroundLine();
    showMenuTextAndImage();
}

function setupInteractiveElements() {
    //set up checkbox
    animationCheckbox = createCheckbox(
        "‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎       ‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏",
        true
    );
    animationCheckbox.position(20, 370);
    animationCheckbox.changed(toggleAnimation);

    //set up sliders
    sliders = [];
    sliders[0] = createSlider(50, 300, 250, 10); //radius
    sliders[1] = createSlider(2, 360, 2, 1); //multiplier
    sliders[2] = createSlider(0, 360, 0, 10); //rotation

    let posX = 20;
    let posY = 420;
    for (const slider of sliders) {
        slider.changed(onSliderUpdate);

        slider.position(posX, posY);
        posY += 60;
    }
}

//shows the text accompanying the sliders and checkbox
function showMenuTextAndImage() {
    let xOffset = canvases.menuCanvas.left;
    let yOffset = canvases.menuCanvas.top;

    fill(theme.textColor); //setting text color

    //show title text
    textFont(assetTextFont, 24);

    text("Cycloid Generator", xOffset, yOffset + 30);

    //revert to original font size
    textFont(assetTextFont, 16);

    //show example image
    imageMode(CORNER);
    image(
        exampleGif,
        xOffset + 10,
        yOffset + 50,
        canvases.menuCanvas.width - 20,
        canvases.menuCanvas.width - 20
    );

    //round off the corners of the gif
    // noFill();
    // stroke(theme.menuColor);
    // strokeWeight(10);
    // ellipse(
    //     xOffset + canvases.menuCanvas.width / 2,
    //     yOffset + 139,
    //     canvases.menuCanvas.width - 10
    // );
    // strokeWeight(1);

    // triangle(x1, y1, x2, y2, x3, y3)
    // fill(theme.textColor);
    //show interactiveElements text
    text(
        `Animate drawing`,
        xOffset + animationCheckbox.x + 20,
        yOffset + animationCheckbox.y + 15
    );
    text(
        `Radius -> ${sliders[0].value()}`,
        xOffset + sliders[0].x + 10,
        yOffset + sliders[0].y + 35
    );
    text(
        `Multiplier -> ${sliders[1].value()}`,
        xOffset + sliders[1].x + 20,
        yOffset + sliders[1].y + 35
    );
    text(
        `Rotation -> ${sliders[2].value()}\xB0`,
        xOffset + sliders[2].x + 20,
        yOffset + sliders[2].y + 35
    );
    // noFill();
}

//toggles between animation and static mode
function toggleAnimation() {
    drawBackground();
    showMenuTextAndImage();
}

function onSliderUpdate() {
    // console.log(this, sliders[2])
    if (this !== sliders[2]) {
        drawBackground();
        cycloid = createCycloid();
        drawBackground();
        showMenuTextAndImage();
    }
}

function keyPressed() {
    //look for keystroke
    if (key === "f" || key === "F") {
        fullscreen(!fullscreen()); //toggle fullscreeen if 'F' key is pressed
    }
}

function drawBackground() {
    //draw background for main canvas area and menu
    rectMode(CORNERS);
    noStroke();
    fill(theme.bgColor);
    rect(
        canvases.drawingCanvas.left,
        canvases.drawingCanvas.top,
        canvases.drawingCanvas.right,
        canvases.drawingCanvas.bottom
    );

    drawBackgroundMenu();

    //line separating two canvases
    drawBackgroundLine();

    //reset changed defaults
    stroke(theme.fgColor);
    rectMode(CORNER);
    noFill();
}

function drawBackgroundMenu() {
    noStroke();
    rectMode(CORNERS);
    fill(theme.menuColor);
    rect(
        canvases.menuCanvas.left,
        canvases.menuCanvas.top,
        canvases.menuCanvas.right,
        canvases.menuCanvas.bottom
    );
    stroke(theme.fgColor);
    rectMode(CORNER);
    noFill();
}

function drawBackgroundLine() {
    stroke(theme.fgColor);
    line(
        canvases.drawingCanvas.left,
        canvases.drawingCanvas.top,
        canvases.drawingCanvas.left,
        canvases.drawingCanvas.bottom
    );
}

//create and return a new Cycloid object, or update values of cycloid object if object is already created
function createCycloid() {
    if (cycloid) {
        cycloid.updateSelf(sliders[0].value(), sliders[1].value());
        return cycloid;
    }
    return new Cycloid(sliders[0].value(), sliders[1].value());
}
