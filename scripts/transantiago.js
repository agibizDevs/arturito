//http://www.transantiago.cl/predictor/prediccion?codsimt=PA420&codser=504
var generar = function(){
  var num_aleatorio = Math.round(Math.random()*(25000000-5000000))+5000000;
  var rut = new Rut(num_aleatorio.toString(), true);
  return rut.getNiceRut()
}


var generarPlantilla = function (flag) {
  var element = '<div id="template" style="height:250px; width:700px;">'+
                    '<div  style=" width: 150px;height: 150px;background-color:'+flag.color+'; border-radius:40px; float:left; margin-right:2px;">'+
                        '<p style="padding-left:46px;padding-top:10px; color:white; font-size:40px; "> '+
                        flag.servicio+
                      '</p>'+
                    '</div>     '+
                    '<div style=" padding-top:1px; font-weight:bold; font-size:20px;" >'+
                        '<p>Destino :'+ flag.destino+'<p>'+
                        '<p>Tiempo estimado :'+flag.horaprediccionbus1 +'</p>'+
                        '<p>Siguiente bus a : '+flag.horaprediccionbus2+'</p>'+
                    '</div>'+
                  '</div>';
    return element;
};






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
                data.servicios.item.forEach(function (flag) {
                  var element = generarPlantilla(flag);
                    resp.push(element);
                })

                //convertir en imagen y retornar imagen
                msg.send(JSON.stringify(resp));

            } else {
              msg.send('Error!');
            }
          }
        });
    }
  });
};
