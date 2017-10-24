// Description:
//   Obtiene info de despacho de un producto a través de Chilexpress
//
//  Dependencies:
//    cheerio
//    string
//
// Commands:
//   hubot chilexpress <CODIGO SEGUIMIENTO>
//
// Author:
//   @rorogallardo based in @devschile hubot

var cheerio = require('cheerio');


module.exports = function(robot) {
  robot.respond(/chilexpress\s?(.*)/i, function(msg) {
    console.log(':mailbox_closed: buscando...');
    var args = msg.match[1];
    var resp = [];
    console.log(args);
    if(args){
      cod = args.toUpperCase();

      var url = 'http://api-correos.herokuapp.com/'+cod.toUpperCase();
      robot.http(url).get()(function (err,res,body) {
        if(err || res.statusCode !==200){
          msg.send('Algo pasó, intente nuevamente.');
          return robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg)
        }
          var data = JSON.parse(body);
          if(data.error){
            msg.send("Ha ocurrido un problema, intente nuevamente.");
          }else{
            if (data) {
              console.log(JSON.stringify(data));
                msg.send(`El envio : ${cod.toUpperCase()} A Nombre de : ${ data.datosgenerales.envio }, ultima actualizacion ${dateFormat.tz('America/Santiago').format('hh:mma DD-MM-YYYY')}.`);
            } else {
              msg.send('Error!');
            }
          }

      });


    }




  });
};
