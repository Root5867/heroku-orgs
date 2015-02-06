var tableOptions = { head: ['App name', 'Owner'] , colWidths: [30, 50] };

var Heroku  = require('heroku-client');
var table   = require('../../table')(tableOptions);
var _       = require('lodash');

module.exports = {
  topic: '_apps',
  command: 'list',
  description: 'Lists all your applications',
  help: 'Example: heroku _apps:list',
  needsAuth: true, // This command needs an auth token to interact with the Heroku API (passed in the context argument)
  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});

    heroku.apps().list(function (err, apps) {
      _.map(_.sortByAll(apps, ['name', 'owner']), function(app){
        table.push([app.name, app.owner.email]);
      });
      console.log(table.toString());
    });
  }
}
