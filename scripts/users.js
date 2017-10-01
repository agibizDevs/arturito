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

   const getUsernameById = function(id){
        if(id != null){
            const users = robot.brain.users();
            Object.keys(users).forEach(k => {
                if(id == users[k].id){
                    return users[k].name;
                }
            });
        }
    }

    const getIdByDisplayName = name => {
        
    }

  robot.respond(/user(.*)/i, (msg) => {
    const name = msg.match[1].split(' ')[1].trim;
    const users = robot.brain.users();
    if(name != null){
        Object.keys(users).forEach(k => {
            let tempName = users[k].slack.profile.display_name;
            let nameId = users[k].id;
            msg.send(`user: ${tempName}`);
            if(name == tempName){
                msg.send(`username: ${nameId}`);
            }
        });
    }
  });
};