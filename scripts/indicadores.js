//   Get values of the different divisas operanting in Chile.


// Commands:
//   arturito valor {CODIGOVALOR}
//   arturito valor help

// Author:
//   @rorogallardo

var moment = require("moment-timezone");

module.exports = function(robot) {
  robot.respond(/valor(.*)/i, function(msg) {
    const args = msg.match[1].split(' ')[1];
    var resp = [];
    if(args){
      cod = args.toUpperCase();
      if(args=="help"){
          msg.send(`Los Valores disponibles son :\n - UF \n - IVP \n - DOLAR \n - DOLAR_INTERCAMBIO \n - EURO \n - IPC \n - UTM \n - IMACEC \n - TPM \n - LIBRA_COBRE \n - TASA_DESEMPLEO.`);
        }else{
        var url = 'http://mindicador.cl/api/'+cod.toLowerCase();
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
            if(data.error){
              msg.send("Indicador erroneo, ingrese nuevamente.");
            }else{
              if (data) {
                  var dateFormat = moment(data.serie[0].fecha);
                  msg.send(`El Valor para ${cod.toUpperCase()} es de ${ (data.unidad_medida.includes("Peso")) ? "$"+data.serie[0].valor+" CLP" : data.serie[0].valor+"%" }, ultima actualizacion ${dateFormat.tz('America/Santiago').format('hh:mma DD-MM-YYYY')}.`);
              } else {
                msg.send('Error!');
              }
            }
          }
        });}


    }
  });
};
