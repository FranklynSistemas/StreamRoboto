// server.js
var cons  = require("consolidate");
var express        = require('express');
var app            = express();
var httpServer = require("http").createServer(app);
var five = require("johnny-five");
//var Raspi = require("raspi-io");
httpServer.listen(3000);
var io= require('socket.io').listen(httpServer);

io.set('log level',1);
//var routes = require('./routes/rutas');
app.engine("html", cons.swig); //Template engine...
app.set("view engine", "html");
app.set("views", __dirname + "/vistas");
app.use(express.static('public'));



app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/video', function(req, res, next) {
  res.render('Video');
});

app.get("*", function(req, res){
  
  res.status(404).send("Página no encontrada :( en el momento");

});

/*
app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/Video.html');
});

app.get('/video', function(req, res) {
        res.sendFile(__dirname + '/public/Video.html');
});
*/

console.log('Servidor disponible en http://localhost:' + 3000);
var motorA1, motorA2, motorB1,motorB2;


var board = new five.Board({
 // io: new Raspi()
});

board.on("ready", function() {
  motorA1 = new five.Led("P1-13");
  motorA2 = new five.Led("P1-15");
  motorB1 = new five.Led("P1-16");
  motorB2 = new five.Led("P1-18");
//  led.blink();
});

//Socket connection handler
io.on('connection', function (socket) {
       // console.log(socket.id);

        socket.on('motorA1:on', function (data) {
           motorA1.on();
           console.log('MotorA1 ON RECEIVED');
        });

        socket.on('motorA1:off', function (data) {
            motorA1.off();
            console.log('MotorA1 OFF RECEIVED');

        });

        socket.on('motorA2:on', function (data) {
           motorA2.on();
           console.log('Motor A2 ON RECEIVED');
        });

        socket.on('motorA2:off', function (data) {
            motorA2.off();
            console.log('motorA2 OFF RECEIVED');

        });

        socket.on('motorB1:on', function (data) {
           motorB1.on();
           console.log('Motor B1 ON RECEIVED');
        });


        socket.on('motorB1:off', function (data) {
            motorB1.off();
            console.log('Motor B1 OFF RECEIVED');

        });

         socket.on('motorB2:on', function (data) {
           motorB2.on();
           console.log('Motor B2 ON RECEIVED');
        });
                  socket.on('motorB2:off', function (data) {
           motorB2.off();
            console.log('Motor B2 OFF RECEIVED');

        });
        socket.on('newFrame',function(obj){
          //console.log("newFrame rcvd");
          //io.sockets.emit('setFrame',obj);
          socket.broadcast.emit('setFrame',obj)
        });


    });

console.log('Waiting for connection');




