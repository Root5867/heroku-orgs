'use strict';

var Heroku      = require('heroku-client');
var _           = require('lodash');
var Utils       = require('./utils');
var co          = require('co');
var heroku;

function printAccess(app, collaborators) {
  let table = [];
  let columnify   = require('columnify');
  let data = {};

  _.map(_.sortBy(collaborators, function(collab) { return collab.email || collab.user.email; }), function(collab) {
    let email = collab.user.email;
    data = { email: email };

    if (Utils.isOrgApp(app.owner.email)) {
      data['privileges'] = _.map(_.sortByAll(collab.privileges, 'name'), 'name');
    } else {
      data['role'] = collab.role || 'collaborator';
    }

    if (!/herokumanager\.com$/.test(email)) {
      table.push(data);
    }
  });

  console.log(columnify(table, { showHeaders: false, columnSplitter: '\t' }));
}

module.exports = {
  topic: 'access',
  needsAuth: true,
  variableArgs: true,
  needsApp: true,

  run: function (context) {
    let organization;
    let args = context.args;
    let appName;

    appName = context.app;

    co(function* () {
      heroku = new Heroku({token: context.auth.password});
      let app = yield heroku.apps(appName).info();
      let path = Utils.isOrgApp(app.owner.email) ? '/organizations' : '';
      path += `/apps/${appName}/collaborators`;

      let collaborators = yield heroku.request({
        method: 'GET',
        path: path,
        headers: { 'accept': 'application/vnd.heroku+json; version=3.org-privileges' }
      });

      if (Utils.isOrgApp(app.owner.email)) {
        let orgName = Utils.getOwner(app.owner.email);
        let admins = yield heroku.get('/organizations/'+orgName+'/members');
        admins = _.filter(admins, { 'role': 'admin' });

        let adminPrivileges = yield heroku.request({
            method: 'GET',
            path: '/organizations/privileges',
            headers: { 'accept': 'application/vnd.heroku+json; version=3.org-privileges' }
          });

        admins = _.forEach(admins, function(admin) {
          admin['user'] = { email: admin.email };
          admin['privileges'] = adminPrivileges;
          return admin;
        });

        collaborators = _.reject(collaborators, { 'role': 'admin'}); // Admins might have already privileges
        collaborators = _.union(collaborators, admins);
      }

      printAccess(app, collaborators);

    }).catch(function (err) {
      console.error(err);
    });
  }
}

