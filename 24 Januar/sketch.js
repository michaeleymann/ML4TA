let model;
let notes = {
  A: 110,
  E: 330,
  G: 196 
}

let envelope, wave, frequency;
let targetLabel = "A";

let state = "collection";

// ----- P5 SETUP -----

function setup() {
  createCanvas(600, 600);
  background(220);

  let options =  {
    inputs: [ "x", "y"],
    output: ["frequency"],
    task: "regression",
    debug: "true"
  };

  model = ml5.neuralNetwork(options)
  setupButtons();

  envelope = new p5.Envelope();
  envelope.setADSR(0.01, 0.7, 0.3, 1);
  envelope.setRange(1.2, 0);

  wave = new p5.Oscillator();
  wave.setType("sine");
  wave.start();
  wave.freq(300);
  wave.amp(envelope);

}

// ----- FUNCTIONS -----

// SETUP BUTTONS
function setupButtons() {
  aButton = createButton("Add A Note");
  aButton.position(620,50);
  aButton.mousePressed( function(){
    targetLabel = "A";

  });

  eButton = createButton("Add E Note");
  eButton.position(620,100);
  eButton.mousePressed( function(){
    targetLabel = "E";
  });

  gButton = createButton("Add G Note");
  gButton.position(620,150);
  gButton.mousePressed( function(){
    targetLabel = "G";
  });


  trainButton = createButton("Train Model");
  trainButton.position(620,500);
  trainButton.mousePressed(function(){
    console.log("Start training");
    model.normalizeData();

    let options = {
      epochs: 60 //FINE TUNE

    }

    model.train(options, whileTraining, doneTraining);

  })

  saveButton = createButton("Save Data");
  saveButton.position(620, 450);
  saveButton.mousePressed(function(){
    model.saveData("notes")
  });

  loadButton = createButton("Load Data");
  loadButton.position(720, 450);
  loadButton.mousePressed(function(){
    model.loadData("notes.json", dataLoaded );

  });
}

// CALLBACK FUNCTIONS
function whileTraining(epoch, loss) {
  console.log("epoch: " + epoch + ", loss: " + loss)
}

function doneTraining(){
  console.log("Done Training")
  state = "prediction";
  clear();
}

function gotResults(error, result){
  if(error){
    console.error(error)
    return;
  }
  console.log(result)
  frequency = result[0].value;
  wave.freq(frequency);
  envelope.play();
}

function dataLoaded(){
  console.log("Data Loaded")
}

//MOUSE PRESSED
function mousePressed(){
  let inputs = {
    x: mouseX,
    y: mouseY
  }

  if ( state == "collection") {
    let targetFrequency = notes[targetLabel];
    let output = {
      frequency: targetFrequency
    }
  
    model.addData(inputs, output)
  
    text(targetLabel, mouseX, mouseY)

    wave.freq(targetFrequency)
    envelope.play()

  } else if ( state == "prediction") {
    model.predict(inputs, gotResults)
  }
}


function draw() {
  //background(220);
  if ( state == "prediction") {
    background(220);
    fill(0);
    if (frequency){
      text(frequency.toFixed(1), mouseX, mouseY)
    }
  }
}
