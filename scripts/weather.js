// Description:
//   Asks for current weather to Wttr.in and show the result
//
//  Dependencies:
//    cheerio
//    string
//
// Commands:
//   hubot weather <city>,<country> | default: your server location
//
// Author:
//   @jorgeepunan

var cheerio = require('cheerio');
var S       = require('string');

module.exports = function(robot) {
  robot.respond(/weather\s?(.*)/i, function(msg) {

    var location = msg.match[1];
    var url = 'http://wttr.in/' + location;

    msg.robot.http(url).get()(function(err, res, body) {

      var $ = cheerio.load(body);
      cleanText = S( $('pre').text() ).stripTags().s;

      msg.send( '```' + cleanText.split('┌')[0] + '```' ); // split first result

    });

  });
};
