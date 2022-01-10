let faceapi;
let video;
let detections;
let nose = {x:-50, y:-50};
let box = {x: 0, y:0 , width:100, height: 100};
let looking = "";
let up = 10;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}


function setup() {
    createCanvas(360, 270);

    // load up your video
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    textAlign(CENTER);

}

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

    background(255);
    image(video, 0,0, width, height) //only show vid as soon as model is ready
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



function whereYouLooking (){
    if ( nose.x < ( box.x + box.width/2 )){
        looking = "left";
    } else if (nose.x > ( box.x + box.width/2 )) {
        looking = "right";
    }
    if ( nose.y < (box.y + box.height/2 - up)) {
        looking += " and up"
    } else if ( nose.y > (box.y + box.height/2)){
        looking += " and down"

    }
}

function draw (){
    
    noFill();
    ellipse(nose.x, nose.y,30,30)
    rect(box.x, box.y, box.width, box.height)
    fill(0);
    textSize(32);
    text(looking,width/2,30);
  }

  // IDEA: Define neutral position, store this as neutral position
  // Check deviation from neutral