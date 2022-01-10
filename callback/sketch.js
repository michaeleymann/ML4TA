function consoleLogger(text){
    console.log(text);
}

function alerter(text) {
    alert(text);
}

function add(a,b, callback ) {
    let result = a+b
    callback(result);
}

add(5,4,consoleLogger)

