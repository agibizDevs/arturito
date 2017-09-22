http://www.transantiago.cl/predictor/prediccion?codsimt=PA420&codser=504

var generar = function(){
  var num_aleatorio = Math.round(Math.random()*(25000000-5000000))+5000000;
  var rut = new Rut(num_aleatorio.toString(), true);
  return rut.getNiceRut()
}




module.exports = function(robot) {
  robot.respond(/transantiago(.*)/i, function(msg) {
    const args = msg.match[1].split(' ')[1];
    if(args!=null){
      msg.send("respondiendo transantiago: "+args);
    }
  });
};
