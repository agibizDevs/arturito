// Description:
//   arturito chorizo

// Dependencies:
//   None

// Configuration:
//   None

// Commands:
//   arturito ql|rql|ctm|rctm|m[áa]tate|culiao|reculiao|remilculiao|te paseo|te meo

// Author:
//   @cvicuna

const pago = [
    `El dia del ñato...`,
    `Me viste care' banco?`,
    `Preguntale a la Arelis`,
    `Cuando pages el piso ql!`,
    `Pobre humano...`,
    `Hoy día choro(?)`
];

module.exports = function(robot) {

  return robot.respond(/cuando pagan?/gi, msg => msg.send( msg.random(pago)));

};