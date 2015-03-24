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
  command: 'add',
  description: 'Add new users to your app using specific privileges',
  help: 'heroku access:add user@email.com --app APP # Add a collaborator to your app\n\n! BETA: heroku access:add user@email.com --app APP --privileges view, deploy, manage, operate # privileges must be comma separated\n! If you want more information about Heroku Enterprise, please contact sales@heroku.com',
  args: [{name: 'user', optional: false}],
  flags: [
    {name: 'app', char: 'a', description: 'app you want to add the user', hasValue: true},
    {name: 'privileges', description: 'list of privileges comma separated', hasValue: true, optional: true}
  ],

  run: function (context) {
    let organization;
    let appName;

    appName = context.app;

    co(function* () {
      heroku = new Heroku({token: context.auth.password});
      // Print message before start doing the action (it depends on the org, etc...):
      // Adding email@domain.com to application APP_NAME...
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
          // Grab privileges, add user with them
          // If there are not privileges, add user with the viewer role
        } else {
          // Add like a regular org app (with member role)
        }
      } else {
        heroku.apps(appName).collaborators().create({ user: context.args.user }, function (err, collaborator) {
          if (err) { console.error(err); }
          console.log(`Adding ${context.args.user} to application ${appName}... done`);
        });
      }

    }).catch(function (err) {
      console.error(err);
    });
  }
}

