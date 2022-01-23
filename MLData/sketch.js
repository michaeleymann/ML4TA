let model;
let outcome;


function setup() {
  noCanvas();

  let options = {
    dataUrl: "data/song_data.csv",
    inputs: [
      //"acousticness", // 0 to 1
      //"danceability", // 0 to 1
      "energy", //0 to 1
      //"key", // 0 to 11, C to H
    ], 
    outputs: ["song_popularity"],
    task: "regression",
    debug: true,
  };

  model = ml5.neuralNetwork(options, modelReady);

  predictButton = select("#predict");
  predictButton.mousePressed(predict);
  //predictButton.position(40,400);
  predictButton.hide();

  trainButton = select("#train");
  trainButton.mousePressed(function () {
    let trainOptions = {
      epochs: 50,
    };

    model.train(trainOptions, whileTraining, finishedTraining);
  });

  //trainButton.position(40, 400);

  saveButton = select("#save");
  //saveButton.position(140,400);
  saveButton.hide();
  saveButton.mousePressed(function(){
    model.save()
  });
}




function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  predictButton.show();
  saveButton.show();
  trainButton.hide();
}

function predict() {
  let akustik = select("#acousticness").value();
  let tanzbar = select("#danceability").value();
  let energie = select("#energy").value();
  let tonart = parseInt(select("#key").elt.value);
  
  let userInputs = {
    //song_duration_ms: dauer, //12 000 bis 1 800 000
    //acousticness: akustik, // 0 to 1
    //danceability: tanzbar, // 0 to 1
    energy:  energie,//0 to 1
    //key: tonart // 0 to 11, C to H
  };
  console.log(userInputs)
  model.predict(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result[0].value);
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}
