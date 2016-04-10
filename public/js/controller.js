var app = angular.module('myApp', ['btford.socket-io']).
    factory('mySocket', function (socketFactory) {
        return socketFactory();
    }).
    controller('ArduController', function ($scope,mySocket) {

      $scope.touched = false;

      $scope.touchStart = function() {
        $scope.touched = true;
      }

      $scope.touchEnd = function() {
        $scope.touched = false;
      }

        $scope.Adelante = function(){
           console.log('Adelante');
           Vibrar();
           mySocket.emit('motorA1:on');
           mySocket.emit('motorB2:on');
        }

        $scope.Atras = function(){
           console.log('Atras');
           Vibrar();
          
           mySocket.emit('motorA2:on');
           mySocket.emit('motorB1:on');
        }

        $scope.Izquierda = function(){
           console.log('Izquierda');
           Vibrar();
           mySocket.emit('motorA1:on');
           mySocket.emit('motorB1:on');
        }

        $scope.Derecha = function(){
           console.log('Derecha');
           Vibrar();
           mySocket.emit('motorB2:on');
           mySocket.emit('motorA1:on');
        }

        $scope.SinMovimiento = function(){
           console.log('SinMovimiento');
           StopVibrar();
           mySocket.emit('motorA1:off');
           mySocket.emit('motorA2:off');
           mySocket.emit('motorB1:off');
           mySocket.emit('motorB2:off'); 
           mySocket.emit('motorA1:off');
           mySocket.emit('motorB2:off');
        }



}).directive('myTouchstart', [function() {
                return function(scope, element, attr) {

                    element.on('touchstart', function(event) {
                        scope.$apply(function() { 
                            scope.$eval(attr.myTouchstart); 
                        });
                    });
                };
            }]).directive('myTouchend', [function() {
                return function(scope, element, attr) {

                    element.on('touchend', function(event) {
                        scope.$apply(function() { 
                            scope.$eval(attr.myTouchend); 
                        });
                    });
                };
            }]);