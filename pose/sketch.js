let faceapi;
let video;
let detections;
let nose = {x:-50, y:-50};
let box = {x: 0, y:0 , width:0, height: 0};
let state = "no face detected (maybe because you are wearing a mask) ";
let vMargin = 5;
let hMargin = 10
let vDir = "none";
let hDir = "none";
let vSpeed = 0;
let hSpeed = 0;
let bite;

let defaultPosition = {};

// Snake and Graphic Variables
let current = {x:0, y:0};
let last = {};
let food = [];
let trail = [];
let trailLength = 50;
let speed = 2;
let showVid = false;
let colors = [ 
  "#e0fbfc", //bg
  "#293241", //snake head
  "#3d5a80", //snake trail
  "#ee6c4d" //food
];

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

// ----- P5 SETUP -----
function setup() {
    canvas = createCanvas(720, 540);
    canvas.parent("content")
    noStroke();

    //sound
    soundFormats('mp3', 'ogg');
    bite = loadSound('bite.mp3');

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(CENTER);

    current.x = width/2;
    current.y = height/2;
}

// ----- P5 DRAW -----
function draw (){

    background(colors[0]);

    if ( showVid == true) {
        push();
        
        translate(video.width, 0);
        scale(-1, 1);
        image(video, 0, 0, video.width , video.height);
        filter(GRAY);
        stroke(0);
        strokeWeight(2);
        noFill();
        ellipse(nose.x, nose.y,30,30)
        rect(box.x, box.y, box.width, box.height)
        pop();
    }

    
    push();
    noFill()
    strokeWeight(10);
    stroke(colors[2])
    rect(0,0,width,height);
    pop();
    textSize(17);
    text(state, width/2, 25)  
    
    
     
    
    // --- STEUERUNG --- //
    if ( vSpeed) {

        current.y += vSpeed / 5;
        current.x += hSpeed / 15;
    }

    // --- ESSEN ZEICHNEN --- //
    if ( food.length < 1 ) {
        food.push({x: random(10, width-10), y: random(10, height-10)});
    }
    for ( let i = 0; i < food.length; i++) {
        fill(colors[3])
        ellipse(food[i].x,food[i].y,10,10)
    }

    // --- SCHWANZ ZEICHNEN ____
    if ( last.x != current.x || last.y != current.y ){
        trail.push({x: current.x, y: current.y});
    }

    for ( let i = 0; i < trail.length; i++) {
        fill(colors[2])
        ellipse(trail[i].x,trail[i].y,10,10);
    }
   
    //SCHLANGE ZEICHNEN
    fill(colors[1])
    ellipse(current.x,current.y,10,10)


    //LÄNGE BESCHRÄNKEN
    if ( trail.length > trailLength) {
        trail.shift();
    }
     // ESSEN
    for ( let i = 0; i < food.length; i++ ){
     if ( abs(current.x-food[i].x)<5 && abs(current.y-food[i].y)<5) {
         food.shift();
         trailLength += 10;
         bite.play()
     }
    }

    // RÄNDER

    if ( current.x > width) {
        current.x = 0;
    }

    if ( current.x < 0) {
        current.x = width;
    }

    if ( current.y > height) {
        current.y = 0;
    }

    if ( current.y < 0) {
        current.y = height;
    }
    last.x = current.x;
    last.y = current.y;
}

// ----- FUNCTIONS FOR THE FACIAL RECOGNITION -----
function modelReady() {
    console.log('ready!')
    faceapi.detect(gotResults)
}

function gotResults(err, result) {
    if (err) {
        console.error(err)
        return
    }

    detections = result;

    if (detections) {
        if (detections.length > 0) {
            drawNose();
            drawRect();
            whereYouLooking();
        }
    }
    faceapi.detect(gotResults)
}

function drawNose(){
  nose.x = detections[0].parts.nose[3].x
  nose.y = detections[0].parts.nose[3].y
}

function drawRect(){
    box.x  = detections[0].alignedRect._box._x;
    box.y  = detections[0].alignedRect._box._y;
    box.width  = detections[0].alignedRect._box._width;
    box.height = detections[0].alignedRect._box._height;
}


function setDefault() {
    defaultPosition.left = nose.x - box.x;
    defaultPosition.right = box.x + box.width - nose.x;
    defaultPosition.bottom = nose.y - box.y;
    defaultPosition.top = box.y + box.height - nose.y;
}

function whereYouLooking (){

    hSpeed = defaultPosition.left - ( nose.x - box.x );
    vSpeed = defaultPosition.top - ( box.y + box.height - nose.y );
    
    if ( !defaultPosition.left) {
        state = "click to set resting position /// press key to toggle video /// cmd-R when behaving strangely"
    }
}

function mouseClicked() {
    setDefault();
}

function keyPressed() {
    showVid = !showVid;
}