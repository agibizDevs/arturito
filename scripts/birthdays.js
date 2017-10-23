//  Admin of the bdays of the collaborators on AGIBIZ


// Commands:
// Agregar fecha    :   arturito agregar cumpleaños <user>,<date[DD/MM]>
// Buscar cumpleaños:   arturito buscar cumpleaños <user>
// Modificar fecha  :   arturito modigicar cumpleaños <user>,<date[DD/MM]>


// Author:
//   @rorogallardo


var moment = require('moment');
module.exports = function(robot) {
    const getCleanName = name => `${name[0]}.${name.substr(1)}`
    const userForMentionName = mentionName => {
      const users = robot.brain.users();
      return Object.keys(users).map(key => users[key]).find(user => mentionName === user.mention_name);
    }

    const getUserByDisplayName = displayname => {
      const users = robot.brain.users();
      return Object.keys(users).map(key => users[key]).find(user => displayname === user.slack.profile.display_name);
    }

    const validarFecha = (date) => {
      var dia = date.split('/')[0],
          mes = date.split('/')[1];
      if(!isNaN(dia) && !isNaN(mes) ){
        if(!/^([0-31])*$/.test(dia) || !/^([0-12])*$/.test(mes) ){
          return false;
        }
        return true;
      }
    }

    const userFromWeb = token => {
      return robot.adapter.client.web.users.list().then(users => {
        const localUsers = robot.brain.users()
        const user1 = users.members.find(x => x.name === token)
        if (!user1) return
        const user2 = localUsers[user1.id]
        if (typeof user2 === 'undefined' || user2 === null) {
          localUsers[user1.id] = {
            id: user1.id,
            name: user1.name,
            real_name: user1.real_name,
            email_address: user1.profile.email,
            slack: {
              id: user1.id,
              team_id: user1.team_id,
              name: user1.name,
              deleted: user1.deleted,
              status: user1.status,
              color: user1.color,
              real_name: user1.real_name,
              tz: user1.tz,
              tz_label: user1.tz_label,
              tz_offset: user1.tz_offset,
              profile: user1.profile,
              is_admin: user1.is_admin,
              is_owner: user1.is_owner,
              is_primary_owner: user1.is_primary_owner,
              is_restricted: user1.is_restricted,
              is_ultra_restricted: user1.is_ultra_restricted,
              is_bot: user1.is_bot,
              presence: 'active'
            },
            room: 'random',
            karma: 0
          }
          robot.brain.save()
        }
        return localUsers[user1.id]
      })
    }

    const usersForToken = token => {
      return new Promise((resolve, reject) => {
        let user
        if (user = robot.brain.userForName(token)) {
          return resolve([user])
        }
        if (user = userForMentionName(token)) {
          return resolve([user])
        }
        if(user = getUserByDisplayName(token)){
          return resolve([user])
        }
        if (robot.adapter.constructor.name === 'SlackBot') {
          userFromWeb(token).then(webUser => {
            if (webUser) {
              return resolve([webUser])
            } else {
              return resolve(robot.brain.usersForFuzzyName(token))
            }
          }).catch(reject)
        } else {
          user = robot.brain.usersForFuzzyName(token)
          resolve(user)
        }
      })
    }

  const userForToken = (token, response) => {
    return usersForToken(token)
      .then(users => {
        let user
        if (users.length === 1) {
          user = users[0]
          if (typeof user.birthday === 'undefined' || user.birthday === null) {
            user.birthday = "";
          }
        } else if (users.length > 1) {
          robot.messageRoom(`@${response.message.user.name}`, `Se más específico, hay ${users.length} personas que se parecen a: ${users.map(user => user.name).join(', ')}.`)
        } else {
          response.send(`Chaucha, no encuentro al usuario '${token}'.`)
        }
        return user
      })
  }

    const addBDay = (userToken, bdate, response) =>{
      var adderUser = response.message.user;
      if(!validarFecha(bdate)){
        response.send(`:warning: El formato de fecha es DD/MM con rangos 0-31 / 0-12`)
        return;
      }
      userForToken(userToken, response)
        .then(targetUser => {
          if (!targetUser) return
          if (targetUser.length === '') return response.send('¡Oe no seai pillo, escribe un nombre!')
          targetUser.birthday = bdate;
          robot.brain.save()
          response.send(`:balloon: Se registró el cumpleaños de : ${getCleanName(targetUser.name)}, con fecha: :calendar:${targetUser.birthday} :balloon:.`)
        }).catch(err => robot.emit('error', err, response))
    }

    const findBDay = (userToken, response) =>{
      userForToken(userToken, response)
        .then(targetUser => {
          if (!targetUser) return
          if (targetUser.length === '') return response.send('¡Oe no seai pillo, escribe un nombre!')
          if(targetUser.birthday != null && targetUser.birthday != ""){
            response.send(`:calendar::balloon: El cumpleaños de : ${getCleanName(targetUser.name)}, es el : :calendar:${targetUser.birthday} :balloon:.`);
          }else{
            response.send(`:warning: No se encontró el cumpleaños de ${getCleanName(targetUser.name)}, para agregarlo y más info : arturito cumpleaños help.`);
          }
        }).catch(err => robot.emit('error', err, response))
    }

    const modifyBDay = (userToken, newBdate, response) =>{
      userForToken(userToken, response)
        .then(targetUser => {
          var oldDate = targetUser.birthday;
          if (!targetUser) return
          if (targetUser.length === '') return response.send('¡Oe no seai pillo, escribe un nombre!')
          targetUser.birthday = newBdate;
          robot.brain.save()
          response.send(`:balloon: Se cambio el cumpleaños de : ${getCleanName(targetUser.name)}, de la fecha : :calendar:${oldDate}, a la fecha: :calendar:${targetUser.birthday} :balloon:.`);
        }).catch(err => robot.emit('error', err, response))
    }

    const triggerCongrats = (msg) =>{
      var currentdate = moment().format("DD/MM");
      const usrs = robot.brain.users();
      var bUsers = [];
      bUsers.push( Object.keys(usrs).map(key => usrs[key]).find(user => currentdate === user.birthday));
      bUsers.forEach(function (usr) {
        console.log("usrrrrrrr"+JSON.stringify(usr));
        var element = {
                      "attachments": [
                          {
                              "color": "#36a64f",
                              "pretext": ":confetti_ball::balloon: Felicidades en tu cumpleaños:balloon::confetti_ball:",
                              "author_name": "AGIBIZ TI",
                              "author_icon": "http://data.whicdn.com/images/165860514/large.png",
                              "title": "Slack API Documentation",
                              "title_link": "https://api.slack.com/",
                              "text": "Nos complace felicitar a "+usr.first_name+" "+" en su día de cumpleaños!, que lo disfrutes!!",
                              "image_url": usr.image_original,
                              "thumb_url": usr.image_original

                          }
                      ]
                  };
        msg.send(JSON.stringify(element));
      });
    }

    robot.respond(/agregar cumpleaños (.*)/i, function(msg) {
         var userToken = msg.match[1].split(' ')[0];
         var bdate = msg.match[1].split(' ')[1];
      //   if(msg.message.user.is_admin){
           if(userToken == null || bdate == null) {
             msg.send(`:warning: Se deben ingresar ambos parametros, más info : arturito cumpleaños help.`);
             return;
           }else{
             addBDay(userToken, bdate, msg);
           }
      //   }else{
        //   msg.send(`:warning: Sin privilegios para realizar la acción, contacte a los administradores.`);
         //}

    });
    robot.respond(/dispara(.*)/i, function(msg) {
      console.log("disparando");
        triggerCongrats(msg);
    });
    robot.respond(/buscar cumpleaños (.*)/i, function(msg) {
         var userToken = msg.match[1].split(' ')[0];
         findBDay(userToken, msg);
    });

    robot.respond(/modificar cumpleaños (.*)/i, function(msg) {
         var userToken = msg.match[1].split(' ')[0];
         var bdate = msg.match[1].split(' ')[1];
         modifyBDay(userToken, bdate, msg);
    });
    robot.respond(/cumpleaños (.*)/i, function(msg) {
      if(msg.match[1] == "help"){
          msg.send( "\n*:calendar:Verifica el username y los rangos de fecha que ingresaras:calendar:\n:musical_keyboard: Agregar fecha    :   arturito agregar cumpleaños <user>,<date[DD/MM]>"+
                            "\n:musical_keyboard: Buscar cumpleaños:   arturito buscar cumpleaños <user>\n:musical_keyboard: Modificar fecha  :   arturito modigicar cumpleaños <user>,<date[DD/MM]>");
      }
    });
////pendiente la funcion que revisa la fecha actuar y la compara con la coleccion de usuarios.



};
