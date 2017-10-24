// Description:
//  entrega un número de RUT válido aleatorio

// Commands:
//   hubot dame un rut

// Author:
//   @cvicuna based on devschile hubot

var Rut     = require("rutjs");

var generar = function(){
  var num_aleatorio = Math.round(Math.random()*(25000000-5000000))+5000000;
  var rut = new Rut(num_aleatorio.toString(), true);
  return rut.getNiceRut()
}

module.exports = function(robot) {
  robot.respond(/dame un rut/i, function(res) {
    res.send( "Un RUT: " + generar() );
  });
};