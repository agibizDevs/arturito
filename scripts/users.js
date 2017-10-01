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
        const users = robot.brain.users();
        if(name != null){
            let tempName;
            Object.keys(users).forEach(k => {
                let tempName = users[k].slack.profile.display_name.trim;
                let tipo = typeof(tempName);
                let nameId = users[k].id;
                //msg.send(`user: ${tempName} - tipo: ${tipo}`);
                if(name == tempName){
                    return nameId;
                }
            });
        }
    }

  robot.respond(/user(.*)/i, (msg) => {
    const name = msg.match[1].split(' ')[1].trim;
    let id = getIdByDisplayName(name);
    msg.send(`${name} - id: ${id}`);
    let username = getUsernameById(id);
    msg.send(`username: ${username}`);
  });
};