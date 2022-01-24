let model;
let outcome;
let pizza = {}




function setup() {
  document.getElementById("main").style.display =  "none";
  myCanvas = createCanvas(200,200);
  myCanvas.parent("pizza");

  makeToppingPositions();

    

  let options = {
    dataUrl: "data/pizza.csv",
    inputs: [
     "diameter",
     "topping",
     "extra_sauce",
     "extra_cheese"
    ], 
    outputs: ["price_rupiah"],
    task: "regression",
    debug: false,
  };

  model = ml5.neuralNetwork(options, modelReady);
  
  predictButton = select("#predict");
  predictButton.mousePressed(predict);

  trainButton = select("#train");
  trainButton.mousePressed(trainModel);

}

function trainModel() {
  let trainOptions = {
    epochs: 24
  };

  model.train(trainOptions, whileTraining, finishedTraining);

}


function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  document.getElementById("main").style.display =  "block";
  document.getElementById("training").style.display =  "none";

}

function makeToppingPositions() {
  pizza.toppingPosition = [];
  for ( i = 0; i < 10; i ++ ) {
    pizza.toppingPosition.push({x: random(-70,70), y: random(-70,70)})
  }
}

function predict() {
  let durchmesser = select("#diameter").value();
  let belag = document.getElementById("topping").value;
  let sosse = document.getElementById("sauce").value;
  let käse = document.getElementById("cheese").value;

  
  let userInputs = {
    diameter: durchmesser,
    topping: belag,
    extra_sauce: sosse,
    extra_cheese: käse
  };
  console.log(userInputs)
  model.predict(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    let r = result[0].value
    console.log(r);
    document.getElementById("result").innerHTML = r.toFixed(0) + " Rupees"
  }
}

function modelReady() {
  console.log("model ready");
  model.normalizeData();
}



function draw(){

  clear();

  pizza.diameter = 100 + select("#diameter").value()*5;
  pizza.scale = pizza.diameter / 200
  pizza.topping = document.getElementById("topping").value
  pizza.sauce = document.getElementById("sauce").value
  pizza.cheese = document.getElementById("cheese").value

  if ( pizza.lastTopping != pizza.topping) {
    makeToppingPositions();
  }


  fill(255,249, 194);
  noStroke();
  ellipse(100,100,pizza.diameter,pizza.diameter);
  fill(255,167,145,170);
  ellipse(100,100,pizza.diameter-10, pizza.diameter-10)
// EXTRA SAUCE

  if ( pizza.sauce == "yes") {
    fill(255,167,145,170);
    ellipse(100,100,pizza.diameter-10, pizza.diameter-10)
    text("SAUCE!", 75,125)
  }

// NORMAL CHEESE
  pizza.cheesePosition = [
    {x: 15, y: 5},
    {x: -50, y: -30},
    {x: 55, y: -65},
    {x: 55, y: 40},
    {x: -40, y: 45},
    {x: -60, y: 0},
    {x: 0, y: 60},
    {x: 10, y: -60},
  ]
  for ( let c of pizza.cheesePosition) {
    push()
    translate(100,100)
    scale(pizza.scale)
    fill(255,255,255,230)
    ellipse(c.x, c.y, 15, 15)
    pop()
  }



// TOPPING


push()
fill(0);
translate(100,100);
scale(pizza.scale);

  if ( pizza.topping == "mushrooms") {
    for ( t of pizza.toppingPosition) {
      fill(115,121,153,200)
      rect(t.x, t.y, 10,10)
    }
  } else if ( pizza.topping == "chicken") {
    for ( t of pizza.toppingPosition) {
      fill(255, 112, 136, 222)
      rect(t.x, t.y, 10,10)
    }
  } else if ( pizza.topping == "mozzarella") {
    for ( t of pizza.toppingPosition) {
      fill(255,255,224,200)
      rect(t.x, t.y, 10,10)
    }
  } else if ( pizza.topping == "papperoni") {
    for ( t of pizza.toppingPosition) {
      fill(119,198,110,200)
      rect(t.x, t.y, 10,10)
    }
  } else if ( pizza.topping == "smoked beef") {
    for ( t of pizza.toppingPosition) {
      fill(180,80,90,200)
      rect(t.x, t.y, 10,10)
    }
  } else if ( pizza.topping == "tuna") {
    for ( t of pizza.toppingPosition) {
      fill(78,81,84,200)
      rect(t.x, t.y, 10,10)
    }
  }
pop();


  //EXTRA CHEESE

  if ( pizza.cheese == "yes") {
    pizza.extraCheesePosition = [
      {x: -10, y: -10},
      {x: -40, y: -60},
      {x: 20, y: -50},
      {x: 30, y: 50},
      {x: -60, y: 40},
      {x: 70, y: 0},
    ]
    for ( let c of pizza.extraCheesePosition) {
      push()
      translate(100,100)
      scale(pizza.scale)
      fill(255,255,255,230)
      ellipse(c.x, c.y, 20, 20)
      pop()
    }

  }

    pizza.lastTopping = pizza.topping;
  
}

