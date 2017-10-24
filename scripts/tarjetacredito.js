// Description:
//   Entrega una tarjeta de crédito autogenerada

// Dependencies:
//   cheerio

// Commands:
//   hubot dame una visa
//   hubot dame una mastercard
//   hubot dame una american express
//   hubot dame una discover

// Author:
//   @cvicuna based on devschile hubot

const {load} = require('cheerio');
const fixExpireDate = (date) => {

  const [ month, year ] = date.split('/');
  const currentDate = new Date();
  const expireDate = new Date(year, month);
  const isDateExpired = currentDate > expireDate;

  if (!isDateExpired) return date;

  // When the credit card date is expire, fix it returning
  // the same month with a current year plus 1
  const fixedYear = currentDate.getFullYear() + 1;
  return `${month}/${fixedYear}`;

};



module.exports = robot => {

  robot.respond(/dame una (visa|mastercard|discover|american express)/i, msg => {

    const quequiere = msg.match[1].toLowerCase();
    let url;

    if (quequiere === 'visa') {

      url = 'http://generatarjetasdecredito.com/generador-tarjetas-visa.php';

    } else if (quequiere === 'american express') {

      url = 'http://generatarjetasdecredito.com/generador-tarjetas-american-express.php';

    } else if (quequiere === 'discover') {

      url = 'http://generatarjetasdecredito.com/generador-tarjetas-discover.php';

    } else if (quequiere === 'mastercard') {

      url = 'http://generatarjetasdecredito.com/generador-tarjetas-mastercard.php';

    } else {

      return false;

    }

    robot.http(url).get()((err, res, body) => {

      if (err) {

        robot.emit('error', err, msg);

      } else {

        const dom = load(body);
        const section = dom(dom('section').get(3));
        const creditCardNumber = section.find('p.resalta').html();
        const cvv = dom(section.find('p.centrado em').get(0)).html().split(': ')[1];
        const expireDate = dom(section.find('p.centrado em').get(1)).html().split(': ')[1];

        msg.send(
          `Nº: ${creditCardNumber}, CVV2/VCV2: ${cvv}, Vence: ${fixExpireDate(expireDate)}`
        );
      }
    });
  });
};