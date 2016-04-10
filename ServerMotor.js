
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var Raspi = require("raspi-io");
var io=require('socket.io')(httpServer);

var port = 3000; 
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
 
httpServer.listen(port);  

console.log('Servidor disponible en http://localhost:' + port); 


var board = new five.Board({
  io: new Raspi()
});
/*
board.on("ready", function() {
  led = new five.Led("P1-13");
  //led.blink();
});
*/
board.on("ready", function() {
  var motor;
  /*
    ArduMoto
      Motor A
        pwm: 3
        dir: 12

      Motor B
        pwm: 11
        dir: 13


    AdaFruit Motor Shield
      Motor A
        pwm: ?
        dir: ?

      Motor B
        pwm: ?
        dir: ?


    Bi-Directional Motors can be initialized by:

      new five.Motor([ 3, 12 ]);

    ...is the same as...

      new five.Motor({
        pins: [ 3, 12 ]
      });

    ...is the same as...

      new five.Motor({
        pins: {
          pwm: 3,
          dir: 12
        }
      });

   */


  motor = new five.Motor({
    pins: {
      pwm: "P1-11",
      dir: "P1-15"
    }
  });

  board.repl.inject({
    motor: motor
  });

  motor.on("start", function() {
    console.log("start", Date.now());
  });

  motor.on("stop", function() {
    console.log("automated stop on timer", Date.now());
  });

  motor.on("forward", function() {
    console.log("forward", Date.now());

    // demonstrate switching to reverse after 5 seconds
    board.wait(5000, function() {
      motor.reverse(50);
    });
  });

  motor.on("reverse", function() {
    console.log("reverse", Date.now());

    // demonstrate stopping after 5 seconds
    board.wait(5000, function() {
      motor.stop();
    });
  });

  // set the motor going forward full speed
  motor.forward(155);
});

/*
//Socket connection handler
io.on('connection', function (socket) {
        console.log(socket.id);

        socket.on('led:on', function (data) {
           led.on();
           console.log('LED ON RECEIVED');
        });

        socket.on('led:off', function (data) {
            led.off();
            console.log('LED OFF RECEIVED');

        });

        socket.on('led1:on', function (data) {
           led1.on();
           console.log('LED ON RECEIVED');
        });
        
        socket.on('led1:off', function (data) {
            led1.off();
            console.log('LED OFF RECEIVED');

        });


    });

console.log('Waiting for connection');
*/