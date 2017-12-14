// Description:
//  
//

// Commands:
//   
//

// Author
//   @cvicuna
//

module.exports = robot => {
    const hubotHost = process.env.HEROKU_URL || process.env.HUBOT_URL || 'http://localhost:8080/'
    const hubotWebSite = `${hubotHost}${robot.name}`
  
    const getCleanName = name => `${name[0]}.${name.substr(1)}`
  
    const getUsers = () => {
        const users = robot.brain.users()
        return JSON.stringify(users);
    }
  
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
            if (typeof user.karma === 'undefined' || user.karma === null) {
              user.karma = 0
            }
          } else if (users.length > 1) {
            robot.messageRoom(`@${response.message.user.name}`, `Se más específico, hay ${users.length} personas que se parecen a: ${users.map(user => user.name).join(', ')}.`)
          } else {
            response.send(`Chaucha, no encuentro al usuario '${token}'.`)
          }
          return user
        })
    }
  
    robot.respond(/brain(.*)/i, (msg) => {
        
        const arg = msg.match[1].split(' ')[1].trim();
    
        if (arg != 'help'){
            const thisUser = msg.message.user
            console.log(`username: ${thisUser.name}`)
            if (thisUser.name.toLowerCase() != 'cvicuna') {
              return msg.send('Tienes que ser :cvicuna: o :rorogallardo: para realizar esta función.')
            }
            else{
                if (arg != 'users') {
                    
                }
                else{
                    if (arg === 'users') {
                        msg.send(`JSON de Usuarios: ${hubotWebSite}/brain/users`)
                    }
                }
            }
        }
        else {
            msg.send('`arturito brain [users]` : muestra [obj] de usuarios');
        }
    });
  
    robot.router.get(`/${robot.name}/brain/users`, (req, res) => {
        const users = getUsers()
        res.setHeader('content-type', 'text/html')
        res.end(`<html>
        <head>
            <title>Lista de Usuarios</title>
            <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Inconsolata:400,700"/>
            <link rel="stylesheet" type="text/css" href="//cdn.rawgit.com/mutable-tools/MutaGrid/master/demo/mutagrid/dist/5/mutagrid.min.css"/>
            <style>body,html{height:100%;box-sizing:border-box}html{overflow-x:hidden}body{background:#262626;color:#ddd;font-size:16px}body,code,pre{font-family:Inconsolata,monospace}code,h1,h2,h3,pre{color:#fff;font-weight:400}a{color:#e74c3c}.text-center{text-align:center}main{padding:5em 1.5em}h1{font-size:18px}h3{margin-top:20px}h2,h3{font-size:16px}hr{opacity:.4}</style>
        </head>
        <body>
          <main class="container">
            <div class="row">
                <div class="column-5 column-center text-center">
                    <h1>Lista de Usuarios</h1>
                    <hr/>
                    <h2>Listado del todos los usuarios</h2>
                    <hr/>
                </div>
            </div>
            <div class="row">
                <div class="column-5 column-center text-center">
                    <span>${users}</span>
                </div>
            </div>
          </main>
        </body>
        </html>`
        )
    })
}
  