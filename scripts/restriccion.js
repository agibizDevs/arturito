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
        //  var conSello = (restriccion.hoy.digitos_con_sello == "" ) ? "No Aplica" : restriccion.hoy.digitos_con_sello;
          msg.send('Las condiciones hoy son:');
          msg.send(':car:Vehiculos Sin sello verde: ' + restriccion.hoy.digitos_sin_sello + ':vertical_traffic_light:\n:car:Vehiculos Con sello verde: ' + conSello+':vertical_traffic_light:');
        });
  });
};
