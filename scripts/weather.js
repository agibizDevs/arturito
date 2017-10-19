// Description:
//   Asks for current weather to Wttr.in and show the result
//
//  Dependencies:
//    cheerio
//    string
//
// Commands:
//   hubot clima <ciudad>,[<pais>optional] | default: your server location
//
// Author:
//   @rorogallardo based in @jorgeepunan weather hubot pluggin

var cheerio = require('cheerio');
var S       = require('string');
function toCelsius(f) {
 return Math.round( (5/9) * (f-32));
}
module.exports = function(robot) {
  robot.respond(/clima\s?(.*)/i, function(msg) {

    var location = msg.match[1];
    var url = 'http://wttr.in/' + location;
    if(location =="help"){
      msg.send(":musical_keyboard: Comando y parametros de busqueda: 'arturito clima <ciudad>[,<pais>Opcional]',\n Ejemplos : \narturito clima Santiago, Chile \narturito clima Punta Arenas");
      return;
    }
    msg.robot.http(url).get()(function(err, res, body) {
      var zx = cheerio.load(body);
      cleanText = S( zx('pre').text() ).stripTags().s;

      if(cleanText.includes("Unknown location")){
        msg.send(":warning: Ciudad incorrecta, más ayuda : 'arturito clima help'");
        return;
      }
      var element =  cleanText.split('┌')[0];
      var offSymbols = element.replace(/[^a-zA-Z 0-9-]+/g,"").replace(" ","_").trim();
      var offWithe = offSymbols.split("     ");
      var result = [];
      for (var i = 0; i < offWithe.length; i++) {
        offWithe[i] = offWithe[i].trim();
        if(offWithe[i]!="-" && offWithe[i]!=""){
          result.push(offWithe[i]);
        }
      }
      var estado = result[1];
      var temp = result[2].replace("C","").replace("F","").split("-");
      for (var i = 0; i < temp.length; i++) {
        temp[i] = toCelsius(temp[i]);
      }
      temp[1] = (temp[1]!=null) ? temp[1] : '----';
      if(estado.includes("Partly cloudy")){
          msg.send( ':thermometer: El clima en : '+location+' sera :sun_small_cloud: Parcialmente Nublado con temperaturas oscilantes en '+temp[0]+'°C & '+temp[1]+'°C, disfruta tu día! ' );
      }else if (estado.includes("Sunny") || element.includes("Clear") ) {
          msg.send( ':thermometer: El clima en : '+location+' sera :sunny: Soleado con temperaturas entre '+temp[0]+'°C & '+temp[1]+'°C, recuerda usar protección solar! ' );
      }else if(estado.includes("rain")) {
          msg.send( ':thermometer: El clima en : '+location+' sera de :rain: Lluvia, se pronostican: '+temp[0]+'°C & '+temp[1]+'°C, recuerda el paraguas!  ' );
      }else if(estado.includes("cloudy")) {
          msg.send( ':thermometer: El clima en : '+location+' sera :cloud: Nublado con fluctuates en '+temp[0]+'°C & '+temp[1]+'°C, ten un buen dia!' );
      }

    });

  });
};
