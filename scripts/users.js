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
    let user = robot.brain.userForName(token);
    return user;
  }

  robot.respond(/user(.*)/i, (msg) => {
    const userName = msg.match[1].split(' ')[1];
    var result = getUserName(userName);
    msg.send(result);
  });
};