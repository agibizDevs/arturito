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
          return resolve([user]);
        }

        if (user = robot.brain.usersForFuzzyName(token)) {
            console.log('usersForFuzzyName');
            return resolve([user])
        }
      })
  }

  robot.respond(/user(.*)/i, (msg) => {
    const name = msg.match[1].split(' ')[1];
    //var users = robot.brain.usersForFuzzyName(name);
    var users = getUserName(name);
    console.log(users);
    if(users.length > 0){
        var user = users[0];
        //# Do something interesting here..
        res.send(`${name} is user - ${user}`);
    }   
  });
};