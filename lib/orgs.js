var Heroku      = require('heroku-client');
var columnify   = require('columnify');
var _           = require('lodash');

module.exports = {
  topic: '_orgs',
  description: 'Lists the organizations you are a member of',
  help: 'Example: heroku _orgs',
  needsAuth: true,
  variableArgs: true,

  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});
    var table = [];
    var organization;
    var args = context.args;

    heroku.get('/organizations', function (err, organizations) {
      _.map(_.sortByAll(organizations, ['name', 'org']), function(org){
        table.push({ name: org.name, role: org.role === 'viewer' ? 'member' : org.role });
      });
      console.log(columnify(table, { showHeaders: false, columnSplitter: '\t' }));
    });
  }
}
