// Description:
//   Get the current steam daily deal.

// Dependencies:
//   "cheerio": "latest"

// Commands:
//   hubot steam daily - Show the current steam daily deal.
//   hubot steam specials [n] - Show top n steam specials.
//   hubot steam [Game Name] - Show game info.
//   hubot steam top [n] - Show games top sellers.
//   hubot steam help - Show available command list.

// Author:
//   @cvicuna

'use strict';
const cheerio = require('cheerio');
const commands = [
  `Comandos de Steam:`,
  "`arturito steam daily` - Muestra la oferta del día.",
  "`arturito steam specials [n]` - Muestra el top n de ofertas especiales (Maximo 5).",
  "`arturito steam top [n]` - Muestra el top n de juegos mas vendidos.",
  "`arturito steam [Nombre Juego]` - Muestra información básica de un juego."
];

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

  const getGameDesc = game => {
    return new Promise((resolve, reject) => {
      getBody(`http://store.steampowered.com/search/?term=${game}`).then(body => {
        const $ = cheerio.load(body);
        let games = $('.search_result_row').slice(0, 1).map(function() {
          return $(this).attr('data-ds-appid');
        }).get();
        resolve(games);
      });
    })
  }

  const getDailyId = () => {
    return new Promise ((resolve, reject) => {
      getBody('http://store.steampowered.com').then(body => {
        const $ = cheerio.load(body);
        var idAttr = $('.dailydeal_desc .dailydeal_countdown').attr('id');
        if (idAttr != undefined){ //halloween, verano, invierno. no daily deal
          var gameId = idAttr.substr(idAttr.length - 6);
          gameId = gameId.replace(/_/gi, "");
          resolve(gameId);
        }
        else { reject(404); }
      })
    })
  }

  const getSpecials = count => {
    return new Promise((resolve, reject) => {
      getBody('http://store.steampowered.com/search/?specials=1').then(body => {
        const $ = cheerio.load(body);
        let games = $('.search_result_row').slice(0, count).map(function() {
          return $(this).attr('data-ds-appid');
        }).get();
        console.log(games);
        resolve(games);
      });
    });
  }

  const getTops = count => {
    return new Promise((resolve, reject) => {
      getBody('http://store.steampowered.com/search/?filter=topsellers').then(body => {
        const $ = cheerio.load(body);
        let games = $('.search_result_row').slice(0, count).map(function() {
          return $(this).attr('data-ds-appid');
        }).get();
        console.log(games);
        resolve(games);
      });
    });
  }

  const getPrice = id => {
    const cookie = 'steamCountry=CL%7Cb8a8a3da46a6c324d177af2855ca3d9b;timezoneOffset=-10800,0;';
    const uri = `http://store.steampowered.com/api/appdetails/?appids=${id}&cc=CL`;
    return new Promise((resolve, reject) => {
      const data = getBody(uri, {key: 'cookie', value: cookie}).then(body => {
        const game = JSON.parse(body)[id].data;
        const desc = game.short_description;
        const name = game.name;
        const price = game.price_overview;
        const final = price.final / 100;
        const initial = price.initial / 100;
        const discount = price.discount_percent;
        return {name: name, final: final, initial: initial, discount: discount, uri: `https://store.steampowered.com/app/${id}`};
      })
      resolve(data);
    })
  }

  const getDesc = id => {
    const cookie = 'steamCountry=CL%7Cb8a8a3da46a6c324d177af2855ca3d9b;timezoneOffset=-10800,0;';
    const uri = `http://store.steampowered.com/api/appdetails/?appids=${id}&cc=CL`;
    return new Promise((resolve, reject) => {
      const data = getBody(uri, {key: 'cookie', value: cookie}).then(body => {
        const game = JSON.parse(body)[id].data;
        const desc = game.short_description;
        const name = game.name;
        const price = game.price_overview;
        const final = price.final / 100;
        const initial = price.initial / 100;
        const discount = price.discount_percent;
        return {name: name, final: final, initial: initial, discount: discount, uri: `https://store.steampowered.com/app/${id}`, desc: desc};
      })
      resolve(data);
    })
  }

  const sendMessage = (message, channel) => {
    if (robot.adapter.constructor.name === 'SlackBot') {
      const options = {unfurl_links: false, as_user: true};
      robot.adapter.client.web.chat.postMessage(channel, message, options);
    } else {
      robot.messageRoom(channel, message);
    }
  }

  robot.respond(/steam(.*)/i, (msg) => {

    const args = msg.match[1].split(' ')[1];
    const cant = msg.match[1].split(' ')[2];
    const full = msg.match[1];

    if (args != 'help'){
      if (args == 'specials') {
        if(!isNaN(cant)){
          if(cant <= 5){
            getSpecials(cant)
            .then(results => {
              const promises = results.map(result => getPrice(result));
              return Promise.all(promises);
            })
            .then(results => {
              const messages = results.map(data => {
                return `Cacha el especial! : *${data.name}*, a sólo $CLP *${data.final}*. Valor original $CLP *${data.initial}*, eso es un -*${data.discount}*%! <${data.uri}|Ver más>`;
              });
              sendMessage(messages.join('\n'), msg.message.room);
            }).catch(err => {
              msg.send('Actualmente _Steam_ no responde.');
              robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg);
            });
          }
          else{
            msg.send('¡TAMALO!, la cantidad de ofertas debe ser menor o igual a 5!');
          }
        }
        else{
          msg.send('¡Oe no po! el valor para la cantidad no es un numero!');
        }
      }
  
      if (args == 'daily') {
        getDailyId().then(getPrice).then(data => {
          sendMessage(`¡Lorea la oferta del día!: *${data.name}*, a sólo $CLP *${data.final}*. Valor original $CLP *${data.initial}*, eso es un -*${data.discount}*%! <${data.uri}|Ver más>`, msg.message.room);                      
        }).catch(err => {
          if (err == 404) {
            msg.send('No se encontró la oferta del día, revisaste los especiales?');
          } else {
            msg.send('Actualmente _Steam_ no responde.');
            robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg);s
          }
        });
      }

      if (args == 'top') {
        if(!isNaN(cant)){
          if(cant <= 5){
            getTops(cant)
            .then(results => {
              const promises = results.map(result => getPrice(result));
              return Promise.all(promises);
            })
            .then(results => {
              const messages = results.map(data => {
                return `Nombre del Juego: *${data.name}*, a sólo $CLP *${data.final}*. eso es un -*${data.discount}*% Off! <${data.uri}|Ver más>`;
              });
              sendMessage(messages.join('\n'), msg.message.room);
            }).catch(err => {
              msg.send('Actualmente _Steam_ no responde.');
              robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg);
            });
          }
          else{
            msg.send('¡TAMALO!, la cantidad de juegos debe ser menor o igual a 5!');
          }
        }
        else{
          msg.send('¡TAMALO!, el valor para la cantidad no es un numero!');
        }
      }
  
      if (args != 'daily' && args != 'specials' && args != 'top'){
        getGameDesc(full).then(getDesc).then(data => {
          if (data.initial > data.final){
            msg.send(`Nombre del Juego: ${data.name}\nValor: $CLP *${data.final}* (*%${data.discount}* Off)\nDescripción: ${data.desc} <${data.uri}|Ver más>`);
          }
          else{
            msg.send(`Nombre del Juego: ${data.name}\nValor: $CLP *${data.initial}*\nDescripción: ${data.desc} <${data.uri}|Ver más>`);      
          }
        }).catch(err => {
          msg.send('Actualmente _Steam_ no responde.');
          robot.emit('error', err || new Error(`Status code ${res.statusCode}`), msg);
        });
      }
    }
    else {
      commands.map(result => {
        sendMessage(result, msg.message.room)
      })    
    }
  });
}