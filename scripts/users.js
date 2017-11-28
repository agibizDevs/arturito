module.exports = function(robot) {
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

      robot.respond(/users/, function(msg) {
        console.log("entro");
        const users = robot.brain.users();
        const list = Object.keys(users);
        list.forEach(function (user) {
          console.log(JSON.stringify(user));

        })
        msg.send(list.join('</li><li>'));
      });

};
