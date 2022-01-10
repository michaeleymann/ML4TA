let classifier;
let label;
let confidence;
let video;

let modelURL = "./model/model.json"

let current = {};
let last = {};
let food = [];
let trail = [];
let trailLength = 50;
let speed = 2;
let showVid = true;
let colors = [ 
  "#e0fbfc", //bg
  "#293241", //snake head
  "#3d5a80", //snake trail
  "#ee6c4d" //food
];


function preload(){
    video = createCapture(VIDEO);
    video.hide();
    classifier = ml5.imageClassifier(modelURL);
    label = "Loading Model"
}

function mouseClicked(){
    showVid = !showVid;
    console.log(showVid)
}

function setup(){
    createCanvas(600,400);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    classifyVideo();

    current.x = width/2;
    current.y = height/2;
}

function draw(){
    background(colors[0]);
    push();
    noFill()
    strokeWeight(10);
    stroke(colors[2])
    rect(0,0,width,height);
    pop();
    
    if ( showVid == true) {
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width , video.height);
    pop();
    text(label, width/2, 20,)  
    }
     
    
    
    // --- STEUERUNG --- //
    if (label == "Looking Up") {
        current.y -= speed;
    }
    if (label == "Looking Down") {
        current.y += speed;
    }
    if (label == "Looking Left") {
        current.x -= speed;
    }
    if (label == "Looking Right") {
        current.x += speed;
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

function classifyVideo(){
    classifier.classify(video, gotResult)
}

function gotResult(error, result){

    if(error){
        console.error(error);
        return;
    }

    classifyVideo();
   
    label = result[0].label;
    confidence = result[0].confidence
}