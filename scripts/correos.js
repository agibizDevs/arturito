// Description:
//   Get the latest status of a shipment from Correos de Chile

// Commands:
//   arturito correos [envio]

// Author:
//   @cvicuna based in @devschile hubot

module.exports = function(robot) {
    
    robot.respond(/correos (.*)/i, function(msg) {
        msg.send(':mailbox_closed: buscando...');
        var search = msg.match[1];
        var mainUrl = 'http://api-correos.herokuapp.com/';
        var url = mainUrl + search;
    
        robot.http(url).get()(function(err, res, body) {
            try {
                data = JSON.parse(body);
                msg.send('- Envío: ' + search + '\n- Estado: ' + data.registros[0].estado + '\n- Fecha: ' + data.registros[0].fecha + '\n- Lugar: ' + data.registros[0].lugar);
            } catch (error) {
                msg.send(body);
            }

        });
    });
};