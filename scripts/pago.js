// Description:
//   arturito pagador

// Dependencies:
//   None

// Configuration:
//   None

// Commands:
//   arturito cuando pagan?

// Author:
//   @cvicuna

const pago = [
    `El dia del ñato...`,
    `Me viste care' banco?`,
    `Preguntale a la Arelis`,
    `Cuando pagues el piso ql!`,
    `Pobre humano...`,
    `Hoy día choro(?)`
];

module.exports = function(robot) {

  return robot.respond(/cuando pagan?/gi, msg => msg.send( msg.random(pago)));

};