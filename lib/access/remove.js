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

      let appInfo = yield heroku.apps(appName).info();

      // Move most of this logic to Utils
      if (Utils.isOrgApp(appInfo.owner.email)) {
        let orgName = Utils.getOwner(appInfo.owner.email);
        let orgInfo = yield heroku.request({
          method: 'GET',
          path: `/v1/organization/${orgName}`,
          headers: { 'accept': 'application/vnd.heroku+json; version=2' }
        });

        orgFlags = orgInfo.flags;
        if (orgFlags.indexOf('org-access-controls') !== -1) {

        } else {

        }
      } else {
        heroku.apps(appName).collaborators(context.args.user).delete(function (err, collaborator) {
          if (err) { console.error(err); }
          console.log(`Removing ${context.args.user} from application ${appName}... done`);
        });
      }

    }).catch(function (err) {
      console.error(err);
    });
  }
}

