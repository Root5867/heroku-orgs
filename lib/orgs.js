'use strict';

var Heroku      = require('heroku-client');
var columnify   = require('columnify');
var _           = require('lodash');
var co          = require('co');

module.exports = {
  topic: '_orgs',
  description: 'Lists the organizations you are a member of',
  help: 'Example: heroku _orgs',
  needsAuth: true,

  run: function (context) {
    var heroku = new Heroku({token: context.auth.password});
    var table = [];

    co(function* () {
      let organizations = yield heroku.get('/organizations');
      _.map(_.sortByAll(organizations, ['name', 'org']), function(org){
        table.push({ name: org.name, role: org.role === 'viewer' ? 'member' : org.role });
      });

      return console.log(columnify(table, { showHeaders: false, columnSplitter: '\t' }));
    }).catch(function (err) {
      console.error(err);
    });
  }
};
