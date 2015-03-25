'use strict';

var Heroku      = require('heroku-client');
var _           = require('lodash');
var Utils       = require('../utils');
var co          = require('co');
var heroku;
var orgFlags;

module.exports = {
  topic: 'access',
  needsAuth: true,
  needsApp: true,
  command: 'remove',
  description: 'Remove users from your app',
  help: 'heroku access:remove user@email.com --app APP',
  args: [{name: 'user', optional: false}],
  flags: [
    {name: 'app', char: 'a', description: 'app from you want to remove the user', hasValue: true}
  ],

  run: function (context) {
    let organization;
    let appName;

    appName = context.app;

    co(function* () {
      heroku = new Heroku({token: context.auth.password});
      heroku.apps(appName).collaborators(context.args.user).delete(function (err, collaborator) {
        if (err) { throw err; }
        console.log(`Removing ${context.args.user} from application ${appName}...done`);
      });
    }).catch(function (err) {
      console.error(err);
    });
  }
}

