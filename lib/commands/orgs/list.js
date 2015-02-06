/*
 * TODO: We might want to add the endpoint GET '/organizations' to `heroku-client`
 *
 */

var tableOptions = { head: ['Organization', 'Role'] , colWidths: [30, 20] };

var Heroku  = require('heroku-client');
var table   = require('../../table')(tableOptions);
var _       = require('lodash');

module.exports = {
  topic: '_orgs',
  command: 'list',
  description: 'Lists the organizations you are a member of',
  help: 'Example: heroku _orgs:list',
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});
    var organization;

    heroku.get('/organizations', function (err, organizations) {
      _.map(_.sortByAll(organizations, ['name', 'org']), function(org){
        organization = [org.name, org.role];
        if (org.default) {
          organization.push('default');
        }
        table.push(organization);
      });
      console.log(table.toString());
    });
  }
}
