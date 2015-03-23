// TODO: Validate arguments

var Heroku      = require('heroku-client');
var columnify   = require('columnify');
var _           = require('lodash');

module.exports = {
  topic: '_apps',
  description: 'Lists your applications',
  help: 'Example: heroku _apps',
  needsAuth: true,
  variableArgs: true,

  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});
    var table = [];
    var data = {};
    var args = context.args;

    if(args.indexOf('--org') !== -1) {
      var index = args.indexOf('--org');
      var orgName = args[index + 1];

      heroku.organizations(orgName).apps().listForOrganization(function(err, apps) {
        if (err) { throw err; }

        _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
          table.push({ name:  app.name });
        });

        printData(table);
      });
    }
    else {
      heroku.apps().list(function(err, apps) {
        if (err) { throw err; }

        heroku.account().info().then(function(user) {
          _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
            if (args.indexOf('--all') !== -1) {
              data = { name:  app.name };

              if (context.args.indexOf('-x') !== -1) {
                data['typeOwner'] = isOrgApp(app.owner.email) ? 'organization' : 'personal';
                data['owner'] = getOwner(app.owner.email);
              }
              table.push(data);
            }
            else if ((args.indexOf('--personal') !== -1) || (args.length === 0) || (args.indexOf('-x') !== -1)) {
              if (!isOrgApp(app.owner.email)) {
                data = { name:  app.name };

                if (context.args.indexOf('-x') !== -1) {
                  data['typeOwner'] = app.owner.email === user.email ? 'owner' : 'collaborator';
                  data['owner'] = app.owner.email;
                }
                table.push(data);
              }
            }
          });
          printData(table);
        });
      });
    }
  }
}

function printData(data) {
  console.log(columnify(data, { showHeaders: false, columnSplitter: '\t' }));
}

function getOwner(owner) {
  if (isOrgApp(owner)) {
    return owner.split('@herokumanager.com')[0];
  }
  return owner;
}

function isOrgApp(owner) {
  return (/herokumanager\.com$/.test(owner));
}
