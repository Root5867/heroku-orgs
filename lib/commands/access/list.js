var Heroku      = require('heroku-client');
var columnify   = require('columnify');
var _           = require('lodash');

module.exports = {
  topic: 'access',
  needsAuth: true,
  variableArgs: true,

  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});
    var table = [];
    var organization;
    var args = context.args;
    var appName;

    // TODO: accept `-a` too
    if ((args.indexOf('--app') !== -1) && (args.length > 1)) {
      appName = args[args.indexOf('--app') + 1];

      // TODO: Check if it's now owned by an org, and then use a different endpoint
      heroku.request({
        method: 'GET',
        path: '/organizations/apps/'+appName+'/collaborators',
        headers: {
          'accept': 'application/vnd.heroku+json; version=3.org-privileges'
        }
      }, function (err, privileges) {
       if (err) { throw err; }

      // TODO: Add admins with full privileges
      _.map(_.sortBy(privileges, function(priv) { return priv.user.email; }), function(collab) {
        if (!/herokumanager\.com$/.test(collab.user.email)) {
          table.push(
            { email: collab.user.email,
              privileges: _.map(_.sortByAll(collab.privileges, 'name'), 'name')
            });
        }
      });

      console.log(columnify(table, { showHeaders: false, columnSplitter: '\t' }));
    });

    }

  }
}
