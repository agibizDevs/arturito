// Description:
//   Get the current steam daily deal.

// Dependencies:
//   "cheerio": "latest"

// Commands:
//   hubot steam daily - Show the current steam daily deal.
//   hubot steam specials [n] - Show top n steam specials.

// Author:
//   @chrisdelcaos


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

  const getDailyId = () => {
    return getBody('http://store.steampowered.com').then(body => {
      const $ = cheerio.load(body);
      const idAttr = $('.dailydeal_desc .dailydeal_countdown').attr('id');
      return idAttr.substr(idAttr.length - 6);
    });
  }

  const getSpecials = () => {
    return getBody('http://store.steampowered.com/search/?specials=1').then(body => {
      const $ = cheerio.load(body);
      var games = [];
      $('.search_result_row').each(function(i, elem) {
        games[i] = $(this).attr('data-ds-appid');
      });
      return games;
    });
  }

  const getPrice = id => {
    const cookie = 'steamCountry=CL%7Cb8a8a3da46a6c324d177af2855ca3d9b;timezoneOffset=-10800,0;';
    const uri = `http://store.steampowered.com/api/appdetails/?appids=${id}&cc=CL`;
    return getBody(uri, {key: 'cookie', value: cookie}).then(body => {
      const game = JSON.parse(body)[id].data;
      const name = game.name;
      const price = game.price_overview;
      const final = price.final / 100;
      const initial = price.initial / 100;
      const discount = price.discount_percent;
      return {name: name, final: final, initial: initial, discount: discount, uri: `https://store.steampowered.com/app/${id}`};
    });
  }

  robot.respond(/steam(.*)/i, (msg) => {

    const args = msg.match[1].split(' ')[1];
    const cant = msg.match[1].split(' ')[2];

    if (args == 'specials') {
      if(!isNaN(cant)){ //console.log(cant);
        if(cant <= 10){
          getSpecials().then(data => {
            for (var i = 0; i < cant; i++) { 
              getPrice(data[i]).then(data => {
                msg.send(`Cacha el especial! : ${data.name}, a sólo $CLP ${data.final}. Valor original $CLP ${data.initial}, eso es un -${data.discount}%! <${data.uri}|link>`);
              })
            }
          }).catch(err => {
            msg.send('Actualmente _Steam_ no responde.');
            robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg)
          });
        }
        else{
          msg.send('Hermano, la cantidad de ofertas debe ser menor a 10!');
        }
      }
      else{
        msg.send('Oe no po! el valor para la cantidad de ofertas no es un numero!');
      }
    }

    if (args == 'daily') {
      getDailyId().then(getPrarturitoice).then(data => {
        msg.send(`¡Lorea la oferta del día!: ${data.name}, a sólo $CLP ${data.final}. Valor original $CLP ${data.initial}, eso es un -${data.discount}%! ${data.uri}`);
      }).catch(err => {
        msg.send('Actualmente _Steam_ no responde.');
        robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg);
      });
    }
  });
};