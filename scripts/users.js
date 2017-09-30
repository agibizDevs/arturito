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
    const userName = msg.match[1].split(' ')[1];
    var result = getUserName(userName);
        msg.send(result);        
  });
};