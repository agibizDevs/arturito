//  Admin of the bdays of the collaborators on AGIBIZ


// Commands:
//   arturito add bday <user>,<date[DD-MM]>

// Author:
//   @rorogallardo


module.exports = function(robot) {


    const getCleanName = name => `${name[0]}.${name.substr(1)}`

    const userForMentionName = mentionName => {
      const users = robot.brain.users()
      return Object.keys(users).map(key => users[key]).find(user => mentionName === user.mention_name)
    }

    const getUserByDisplayName = displayname => {
      const users = robot.brain.users();
      return Object.keys(users).map(key => users[key]).find(user => displayname === user.slack.profile.display_name)
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
      userForToken(userToken, response)
        .then(targetUser => {
          if (!targetUser) return
          if (targetUser.length === '') return response.send('¡Oe no seai pillo, escribe un nombre!')
          targetUser.birthday = bdate;
          robot.brain.save()
          response.send(`:balloon: Se registró el cumpleaños de : ${getCleanName(targetUser.name)}, con fecha: ${targetUser.birthday} :balloon:.`)
        }).catch(err => robot.emit('error', err, response))
    }

    const findBDay = (userToken, response) =>{
      userForToken(userToken, response)
        .then(targetUser => {
          if (!targetUser) return
          if (targetUser.length === '') return response.send('¡Oe no seai pillo, escribe un nombre!')
          if(targetUser.birthday != null && targetUser.birthday != ""){
            response.send(`:balloon: El cumpleaños de : ${getCleanName(targetUser.name)}, es el : ${targetUser.birthday} :balloon:.`);
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
          response.send(`:balloon: Se cambio el cumpleaños de : ${getCleanName(targetUser.name)}, de la fecha : ${oldDate}, a la fecha: ${targetUser.birthday} :balloon:.`)
        }).catch(err => robot.emit('error', err, response))
    }


    robot.respond(/agregar cumpleaños (.*)/i, function(msg) {
         var userToken = msg.match[1].split(' ')[0];
         var bdate = msg.match[1].split(' ')[1];
         addBDay(userToken, bdate, msg);
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

};
