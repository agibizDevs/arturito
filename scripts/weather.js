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
//var $       = require('jQuery');
var S       = require('string');
module.exports = function(robot) {
  robot.respond(/clima\s?(.*)/i, function(msg) {

    var location = msg.match[1];
    var url = 'http://wttr.in/' + location;

    msg.robot.http(url).get()(function(err, res, body) {
      var zx = cheerio.load(body);
      cleanText = S( zx('pre').text() ).stripTags().s;
      var element =  cleanText.split('┌')[0];
      console.log(element);
      var offSymbols = element.replace(/[^a-zA-Z 0-9-°]+/g,"").replace(" ","_").trim();
      var offWithe = offSymbols.split("     ");
      for (var i = 0; i < offWithe.length; i++) {
        console.log("elemento white "+offWithe[i].trim());
      }

      var estado = offWithe[2].trim();
      var temp = offWithe[3].trim();

   if(estado.includes("Partly cloudy")){
          msg.send( '```El clima en : '+location+' sera :sun_small_cloud: Parcialmente Nublado con temperaturas oscilantes en '+temp+', disfruta tu día! ```' );
      }else if (estado.includes("Sunny") || element.includes("Clear") ) {
          msg.send( '```El clima en:'+location+' sera :sunny: Soleado con temperaturas entre '+temp+', recuerda usar protección solar!  ```' );
      }else if(estado.includes("rain")) {
          msg.send( '```El clima en:'+location+' sera de :rain: Lluvia, se pronostican: '+temp+', recuerda el paraguas!  ```' );
      }else if(estado.includes("cloudy")) {
          msg.send( '```El clima en:'+location+' sera :cloud: Nublado con fluctuates en '+temp+', ten un buen dia!  ```' );
      }

    });

  });
};
