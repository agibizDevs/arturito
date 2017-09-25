module.exports = function(robot) {
  robot.respond(/indicadores(.*)/i, function(msg) {
    const args = msg.match[1].split(' ')[1];
    var resp = [];
    if(args){
      cod = args.toUpperCase();
        var url = 'http://mindicador.cl/api/'+cod.toLowerCase();
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
            if(data.error){
              msg.send("Indicador erroneo, ingrese nuevamente.");
            }else{
              if (data) {
                  msg.send(`El Valor para ${cod.toUpperCase()} es de ${data.serie[0].valor}, unidad medida : ${data.unidad_medida}, ultima actualizacion ${new Date(data.serie[0].fecha)}.`);
              } else {
                msg.send('Error!');
              }
            }

          }
        });
    }
  });
};
