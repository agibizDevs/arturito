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
        if (user = robot.brain.userName(token)) {
          return resolve([user]);
        }

        if (user = robot-brain.userForFuzzyName(token)) {
          return resolve([user])
        }

        if (user = robot-brain.userForFuzzyName(token)) {
            return resolve([user])
        }
      })
  }

  robot.respond(/user(.*)/i, (msg) => {
    const name = msg.match[1].split(' ')[1];
    var users = robot.brain.usersForFuzzyName(name)
    if(users.length == 1){
        var user = users[0];
        //# Do something interesting here..
        res.send(`${name} is user - #{user}`);
    }   
  });
};