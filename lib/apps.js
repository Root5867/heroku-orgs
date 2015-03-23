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
  variableArgs: true,

  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});
    let table = [];
    let data = {};
    let args = context.args;

    co(function* () {
      if(args.indexOf('--org') !== -1) {
        let orgName = args[args.indexOf('--org') + 1];
        let apps = yield heroku.organizations(orgName).apps().listForOrganization();

        _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
          table.push({ name:  app.name });
        });
        Utils.printData(table);
      } else {
        let apps = yield heroku.apps().list();
        let account = yield heroku.account().info();

        _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
          if (args.indexOf('--all') !== -1) {
            data = { name:  app.name };

            if (context.args.indexOf('-x') !== -1) {
              data['typeOwner'] = Utils.isOrgApp(app.owner.email) ? 'organization' : 'personal';
              data['owner'] = Utils.getOwner(app.owner.email);
            }
            table.push(data);
          }
          else if ((args.indexOf('--personal') !== -1) || (args.length === 0) || (args.indexOf('-x') !== -1)) {
            if (!Utils.isOrgApp(app.owner.email)) {
              data = { name:  app.name };

              if (context.args.indexOf('-x') !== -1) {
                data['typeOwner'] = app.owner.email === account.email ? 'owner' : 'collaborator';
                data['owner'] = app.owner.email;
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
}
