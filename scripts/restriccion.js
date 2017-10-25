//  Get the daily car restriction.


// Commands:
//   arturito restriccion

// Author:
//   @rorogallardo


module.exports = function(robot) {
  robot.respond(/restriccion/, function(msg) {
        var url = 'http://www.uoct.cl/historial/ultimos-eventos/json/';
        robot.http(url).get()(function (err,res,body) {
          if(err || res.statusCode !==200){
            msg.send(':exclamation: Algo pasó, intente nuevamente.');
            return robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg)
          }
          var data = JSON.parse(body);
          var restriccion = data.restriccion;
          msg.send('Las condiciones hoy son:');
          msg.send(`Para :car:vehiculos sin sello verde: ' + restriccion.hoy.digitos_sin_sello + '\n -:car:vehiculos con sello verde: ' + restriccion.hoy.digitos_con_sello.`);
        });
  });
};
