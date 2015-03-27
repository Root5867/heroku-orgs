'use strict';

var Heroku      = require('heroku-client');
var _           = require('lodash');
var Utils       = require('./utils');
var co          = require('co');

module.exports = {
  topic: '_apps',
  description: 'Lists your applications',
  help: 'Example: heroku _apps',
  needsAuth: true,
  flags: [
    {name: 'org', char: 'o', description: 'the org to list the apps for', hasValue: true},
    {name: 'x', char: 'x', description: 'extended information', hasValue: false},
    {name: 'all', char: 'A', description: 'list all apps you have access to', hasValue: false},
    {name: 'personal', char: 'p', description: 'list personal apps', hasValue: false},
  ],

  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});

    co(function* () {
      let data = {};
      let table = [];
      if(context.args.org) {
        let apps = yield heroku.organizations(context.args.org).apps().listForOrganization();
        _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
          table.push({ name:  app.name });
        });
        Utils.printData(table);
      } else {
        let apps = yield heroku.apps().list();
        let account = yield heroku.account().info();

        _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
          if (context.args.all) {
            data = { name:  app.name };

            if (context.args.x) {
              data.typeOwner = Utils.isOrgApp(app.owner.email) ? 'organization' : 'personal';
              data.owner = Utils.getOwner(app.owner.email);
            }
            table.push(data);
          }
          else if (context.args.personal || Object.keys(context.args).length === 0 || context.args.x) {
            if (!Utils.isOrgApp(app.owner.email)) {
              data = { name:  app.name };

              if (context.args.x) {
                data.typeOwner = app.owner.email === account.email ? 'owner' : 'collaborator';
                data.owner = app.owner.email;
              }
              table.push(data);
            }
          }
        });
        Utils.printData(table);
      }

    }).catch(function (err) {
      console.error(err);
    });
  }
};
