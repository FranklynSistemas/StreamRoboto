// Configuracion Inicial
// ============= server.js ===============================
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
//=========================================================

// ============ Rutas de la interfaz de Usuario ====================
app.get('/', function(req, res, next) {
  res.render('index'); // Muestra el menu
});

app.get('/manual', function(req, res, next) {
  res.render('ControlManual'); // Muestra el Control Manual
});

app.get('/video', function(req, res, next) {
  res.render('Video'); // Utiliza la camara de un celular para enviar video
});

app.get('/vr', function(req, res, next) {
  res.render('ControlVr'); // Crea dos imagenes paralelas del mismo tamaño, ideal para las Carboard
});

app.get('/auto', function(req, res, next) {
  res.render('Automatico'); // Muestra un menu de opciones para enviar parametros que el vehiculo debera ejecutar 
  // de Forma Automatica
});

app.get('/voz', function(req, res, next) {
  res.render('voz'); // Muestra un menu de opciones para enviar parametros que el vehiculo debera ejecutar 
  // de Forma Automatica
});
//Ruta si no se encuentra lo que el usuario busca
app.get("*", function(req, res){
  res.status(404).send("Página no encontrada :( en el momento");
});
//=================================================================================

console.log('Servidor disponible en http://localhost:' + 3000);
//Variales para la creacion de los pines del Raspberry PI 2
var motorA1, motorA2, motorB1,motorB2;
// Variables para la configuracion del control Automatico
var Distancia = 0,
    DistanciaUser=0;
//Configuracion del Hardware a utilizar, para nuestro Caso:  Raspberry Pi 2
var board = new five.Board({
 // io: new Raspi()
});

// Inicializacion del sistema con los pines a utilizar
board.on("ready", function() {
  motorA1 = new five.Led("P1-13");
  motorA2 = new five.Led("P1-15");
  motorB1 = new five.Led("P1-16");
  motorB2 = new five.Led("P1-18");
});

//==================== Sistema de Control en tiempo real Socket.io ==============================
//Socket connection handler
io.on('connection', function (socket) {

		// Funciones para encender y apagar las señales enviadas a cada motor siempre dos.
        // Encender y apagar señales del Motor A
        
        socket.on('motorA1:on', function (data) {
           //motorA1.on();
           console.log('MotorA1 ON RECEIVED');
        });

        socket.on('motorA1:off', function (data) {
            //motorA1.off();
            console.log('MotorA1 OFF RECEIVED');

        });

        socket.on('motorA2:on', function (data) {
           //motorA2.on();
           console.log('Motor A2 ON RECEIVED');
        });

        socket.on('motorA2:off', function (data) {
            //motorA2.off();
            console.log('motorA2 OFF RECEIVED');

        });
        //============================================

        // Encender y apagar señales del Motor B
        socket.on('motorB1:on', function (data) {
           //motorB1.on();
           console.log('Motor B1 ON RECEIVED');
        });

        socket.on('motorB1:off', function (data) {
            //motorB1.off();
            console.log('Motor B1 OFF RECEIVED');
        });

        socket.on('motorB2:on', function (data) {
           //motorB2.on();
           console.log('Motor B2 ON RECEIVED');
        });
        socket.on('motorB2:off', function (data) {
           //motorB2.off();
           console.log('Motor B2 OFF RECEIVED');

        });
        //==============================================

        //Funcion que emite la imagen recibida desde la camara del celular a los clientes que la requieran
        socket.on('newFrame',function(obj){
          //console.log("newFrame rcvd");
          //io.sockets.emit('setFrame',obj);
          socket.broadcast.emit('setFrame',obj)
        });
        //Funcion utilizada para identificar la direccion a la cual se esta llevando el vehiculo,  esto para Debugging
        socket.on('console',function(obj){
          //console.log("newFrame rcvd");
          //io.sockets.emit('setFrame',obj);
          console.log('Direccion '+obj);
        });
        //Funcion para el inicio de los movimientos Automaticos
        socket.on('Iniciar',function(obj){
          console.log('Datos'+obj.Distancia);
          DistanciaUser = obj.Distancia;
          Mover();
        });
        // Funcion para detener el movimiento Automatico
        socket.on('Detener',function(obj){
          Detener();
        });

    });

function Mover(){
  motorA2.on();
  motorB1.on();
}

/*
function Mover(){
  Distancia++;
  motorA2.on();
  motorB1.on();

  setTimeout(function(){
    if(Distancia<DistanciaUser){
      Mover();
    }else if(detener===false){
      motorA2.off();
      motorB1.off();
      motorB2.on();
      setTimeout(function(){Distancia=0;Mover()},1000);
    }
  },1000);
}
*/
function Detener(){
      motorA1.off();
      motorA2.off();
      motorB1.off();
      motorB2.off();
}

console.log('Waiting for connection');




