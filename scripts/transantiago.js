//http://www.transantiago.cl/predictor/prediccion?codsimt=PA420&codser=504
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
        var url = 'http://www.transantiago.cl/predictor/prediccion?codsimt='+cod+'&codser=';
        console.log("url solicitud : " + url);
        robot.http(url).get()(function (err,res,body) {
          if(err || res.statusCode !==200){
            msg.send('Algo pasó, intente nuevamente.');
            return robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg)
          }
          if (body.indexOf('<') > -1) {
            msg.send('Error, verifique el codigo de paradero');
          }else{
            res.setEncoding('utf-8');
            var data = JSON.parse(body);
            if (data) {
              msg.send(`====== DATOS PARA LA PARADA : ${cod} ======`);
              data.servicios.item.forEach(function (flag) {
                if(flag.horaprediccionbus1!=null){
                  msg.send(`Recorrido : ${flag.servicio}, Primer bus : ${flag.horaprediccionbus1} a ${flag.distanciabus1} metros y el segundo : ${flag.horaprediccionbus2} a ${flag.distanciabus2} metros.`);
                }
              });

            } else {
              msg.send('Error!');
            }
          }
        });
    }
  });
};
