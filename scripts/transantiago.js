//   Get time and distances of transantiago bus stop.


// Commands:
//   arturito transantiago {CODIGOPARADA}

// Author:
//   @rorogallardo


var moment = require("moment-timezone");
var generar = function(){
  var num_aleatorio = Math.round(Math.random()*(25000000-5000000))+5000000;
  var rut = new Rut(num_aleatorio.toString(), true);
  return rut.getNiceRut()
}

var generarPlantilla = function (items) {
  var arrItems = [];

  items.item.forEach(function (flag) {
    var arrField = {
      "Recorrido": flag.servicio,
      "value": "1ER bus "+ flag.horaprediccionbus1 + "\n 2DO bus :"+flag.horaprediccionbus2
    };
    arrItems.push(arrField);
  });

    var element = {
      "attachments": [
          {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#36a64f",
              "pretext": "Consulta para la parada ",
              "text": "Tiempo de espera recorridos",
              "fields": arrItems,
              "footer": "TRANSANTIAGO",
              "footer_icon": "http://www.transantiago.cl/imagenes/paginas/20150720095411-10.png"
          }
      ]
  };
  return arrItems;
}

module.exports = function(robot) {
  robot.respond(/transantiago(.*)/i, function(msg) {
    const args = msg.match[1].split(' ')[1];
    var resp = [];
    if(args){
      cod = args.toUpperCase();
        var url = 'http://dev.adderou.cl/transanpbl/busdata.php?paradero='+cod;
        console.log("url solicitud : " + url);
        robot.http(url).get()(function (err,res,body) {
          if(err || res.statusCode !==200){
            console.log(":exclamation: Solicitud incorrecta, detalles: "+ cod);
            msg.send(':exclamation: Algo pasó, intente nuevamente.');
            return robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg)
          }
          res.setEncoding('utf-8');
          var data = JSON.parse(body);
          data.servicios.forEach(function (serv) {
            if(serv.valido == 0){
              msg.send(`:warning: Recorrido : ${serv.servicio} Fuera de horario de operación.`);
            }else{
              msg.send(`:bus: Recorrido : ${serv.servicio}, Primer bus : :id: [ ${serv.patente} ] ${serv.distancia} a ${serv.tiempo} metros.`);
            }
          })
          if(data.descripcion.includes("Paradero no")){
            msg.send(":exclamation: Código de parada incorrecto, verifique y re-intente");
            return;
          }
        });
    }
  });
};
