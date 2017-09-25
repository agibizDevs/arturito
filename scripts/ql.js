
// Description:
//   arturito chorizo

// Dependencies:
//   None

// Configuration:
//   None

// Commands:
//   arturito ql|rql|ctm|m[áa]tate|culiao|reculiao|remilculiao

// Author:
//   @cvicuna

const wea = [
    `Cha, pero pa que po!`,
    `Weno y que pasa perkin ql!`,
    `Te tiraste a la salida cochino ql!`,
    `Pa' que tan zarpao peaso e' logi!`,
    `Seguro vo' soy muy vio zhii!`,
    `No pesco a wnes!`,
    `Y tu hermana?`,
    `Seguro vo soy vioh!`,
    `Puros giles!`,
    `Ando Tapizao!`,
];

module.exports = function(robot) {

  return robot.respond(/ql|rql|ctm|m[áa]tate|culiao|reculiao|remilculiao|te paseo/gi, msg => msg.send( msg.random(wea)));

};