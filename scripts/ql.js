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

const wea = [
    `Cha, pero pa que po!`,
    `Weno y que pasa perkin ql!`,
    `Te tiraste a la salida oe!`,
    `Pa' que tan zarpao peaso e' logi!`,
    `Seguro vo' soy muy vio zhii!`,
    `No pesco a wnes!`,
    `Y tu hermana?`,
    `Una vez pa' los vioh!`,
    `Puros giles!`,
    `Ando Tapizao!`,
    `Mas Vivaldi y menos Pavarotti!`,
    `Me habló alguien?`
];

module.exports = function(robot) {

  return robot.respond(/ql|rql|ctm|rctm|m[áa]tate|culiao|reculiao|remilculiao|te paseo|te meo/gi, msg => msg.send( msg.random(wea)));

};