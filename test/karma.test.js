'use strict'

const test = require('ava')
const Helper = require('hubot-test-helper')

const helper = new Helper('../scripts/karma.js')

test.beforeEach(t => {
  t.context.room = helper.createRoom({httpd: true})
  t.context.room.robot.golden = {
    isGold: () => false
  }
  t.context.room.robot.adapter.client = {
    rtm: {
      dataStore: {
        getChannelGroupOrDMById: function () {
          return {is_channel: true}
        }
      }
    },
    web: {
      users: {
        list: function () {
          return new Promise(function (resolve) {
            resolve({
              members: [
                {name: 'cvicuna', slack: {profile: {display_name: 'cvicuna'}}},
                {name: 'rorrogallardo', slack: {profile: {display_name: 'rorrogallardo'}}}
              ]
            })
          })
        }
      }
    }
  }
  t.context.room.robot.brain.userForId('cvicuna', {
    name: 'cvicuna', id: 1, slack: {profile: {display_name: 'cvicuna'}}
  })
  t.context.room.robot.brain.userForId('rorrogallardo', {
    name: 'rorrogallardo', id: 2, slack: {profile: {display_name: 'rorrogallardo'}}
  })
  t.context.room.robot.brain.karmaLimits = {
    user: {1: new Date()}
  }
  t.context.room.robot.brain.data._private['karmaLog'] = [
    {
      name: 'chrisdelcaos',
      karma: '-1',
      targetName: 'rorrogallardo',
      date: '2017-10-21T15:01:30.633Z',
      msg: 'roro--'
    }
  ]
})
test.afterEach(t => {
  t.context.room.destroy()
})
test.cb.serial('Debe aplicar a un usuario', t => {
  t.context.room.user.say('user', 'rorrogallardo-- asdf')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['user', 'rorrogallardo-- asdf'],
      ['hubot', 'r.orrogallardo ahora tiene -1 puntos de karma.']
    ])
    t.end()
  }, 500)
})
test.cb.serial('No Debe aplicar karma', t => {
  t.context.room.user.say('user', 't++')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['user', 't++'],
      ['hubot', `Chaucha, no encuentro al usuario \'t\'.`]
    ])
    t.end()
  }, 500)
})
test.cb.serial('No Debe aplicar karma', t => {
  t.context.room.user.say('user', '++')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [['user', '++']])
    t.end()
  }, 500)
})
test.cb.serial('No Debe aplicar karma', t => {
  t.context.room.user.say('cvicuna', 'cvicuna++')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['cvicuna', 'cvicuna++'],
      ['hubot', '¡Oe no po, el karma es pa otros no pa ti!']
    ])
    t.end()
  }, 500)
})
test.cb.serial('Aplica karma solo si es menos a uno mismo', t => {
  t.context.room.user.say('cvicuna', 'cvicuna--')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['cvicuna', 'cvicuna--'],
      ['hubot', 'c.vicuna ahora tiene -1 puntos de karma.'],
    ])
    t.end()
  }, 500)
})
test.cb.serial('No Debe aplicar karma', t => {
  t.context.room.user.say('user', 'cvicuna++')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages[0], ['user', 'cvicuna++'])
    t.regex(t.context.room.messages[1][1], /¡No abuses! Intenta en \d+ minutos./)
    t.end()
  }, 500)
})
test.cb.serial('Debe mostrar url', t => {
  t.context.room.user.say('user', 'karma todos')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['user', 'karma todos'],
      ['hubot', 'Karma de todos: http://localhost:8080/hubot/karma/todos']
    ])
    t.end()
  }, 500)
})
test.cb.serial('Debe mostrar puntaje y url', t => {
  t.context.room.user.say('user', 'karma cvicuna')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['user', 'karma cvicuna'],
      ['hubot', 'c.vicuna tiene 0 puntos de karma. Más detalles en: http://localhost:8080/hubot/karma/log/cvicuna']
    ])
    t.end()
  }, 500)
})
test.cb.serial('No debe resetar', t => {
  t.context.room.user.say('user', 'karma reset rorrogallardo')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['user', 'karma reset rorrogallardo'],
      ['hubot', 'Tienes que ser :cvicuna: para realizar esta función.']
    ])
    t.end()
  }, 500)
})
test.cb.serial('Debe resetar', t => {
  t.context.room.user.say('cvicuna', 'karma reset rorrogallardo')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['cvicuna', 'karma reset rorrogallardo'],
      ['hubot', 'r.orrogallardo ha quedado libre de toda bendición o pecado.']
    ])
    t.end()
  }, 500)
})
test.cb.serial('Debe resetar', t => {
  t.context.room.user.say('cvicuna', 'karma reset todos')
  setTimeout(() => {
    t.deepEqual(t.context.room.messages, [
      ['cvicuna', 'karma reset todos'],
      ['hubot', 'Todo el mundo ha quedado libre de toda bendición o pecado.']
    ])
    t.end()
  }, 500)
})
