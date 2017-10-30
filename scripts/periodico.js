// Description:
//   Get the current periodic daily.

// Dependencies:
//   "cheerio": "latest"

// Commands:
//   hubot diario [nombre] - Show .
//   hubot steam specials [n] - Show top n steam specials.

// Author:
//   @cvicuna

'use strict';
const cheerio = require('cheerio');

module.exports = (robot) => {

    const getBody = (uri, header=null) => {
        return new Promise((resolve, reject) => {
          let request
            if (header) {
                request = robot.http(uri).header(header.key, header.value);
            } else {
                request = robot.http(uri);
            }
            request.get()((err, res, body) => {
              if (err || res.statusCode !== 200) {
                  return reject(err || new Error(`Status code ${res.statusCode}`));
              }
              resolve(body);
            });
        });
    }

    const getPortada = name => {
        const uri = `https://www.readmetro.com/es/chile/santiago/20171025/1/`;
        return new Promise((resolve, reject) => {
          const data = getBody(uri).then(body => {
            const game = JSON.parse(body)[id].data;
            const desc = game.short_description;
            const name = game.name;
            const price = game.price_overview;
            const final = price.final / 100;
            const initial = price.initial / 100;
            const discount = price.discount_percent;
            return {data};
          })
          resolve(data);
        })
    }

    robot.respond(/diario(.*)/i, (msg) => {

        const args = msg.match[1].split(' ')[1];
        if(args = 'publimetro'){
            
        }
    })
}