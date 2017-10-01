// Description:
//   show user data

// Commands:
//   user <name> - shows user data
//

// Notes
//

// Author
//   @cvicuna

'use strict';

module.exports = (robot) => {

  const getUserName = function(token){
    return new Promise((resolve, reject) => {
        let user
        if (user = robot.brain.userForName(token)) {
            console.log('userForNAME');
          return resolve(user);
        }

        if (user = robot.brain.usersForFuzzyName(token)) {
            console.log('usersForFuzzyName');
            return resolve(user)
        }
      })
  }

  robot.respond(/user(.*)/i, (msg) => {
    const name = msg.match[1].split(' ')[1];
    var users = robot.brain.usersForFuzzyName(name);
    var users2 = robot.brain.userForName(name);
    //var users = getUserName(name);
    if(users != null && users.length > 0){
        let user = users[0];
        //# Do something interesting here..
        msg.send(`${name} is user - ${JSON.stringify(users)}`);
        console.log(user);
    }   
    else{
        msg.send(`no se encontraron datos para ${name}`);
    }
    if(users2 != null && users2.length > 0){
        let user = users2[0];
        //# Do something interesting here..
        msg.send(`${name} is user2 - ${JSON.stringify(users)}`);
        console.log(user);
    }     
    else{
        msg.send(`no se encontraron datos2 para ${name}`);
    }
  });
};