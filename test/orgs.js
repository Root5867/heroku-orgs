// !!! NOT PASSING YET.
'use strict';

var nock = require('nock');
var netrc = require('netrc')()['api.heroku.com'];
var assert = require('assert');

describe('_orgs', function () {
  var cmd = require('../lib/orgs');
  var heroku;

  beforeEach(function () {
    heroku = nock('https://api.heroku.com:443')
    .get('/organizations')
    .reply(200, [{
      "created_at": "2014-12-05T18:00:59Z",
      "credit_card_collections": false,
      "default": false,
      "name": "og-name",
      "provisioned_licenses": false,
      "role": "admin",
      "updated_at": "2014-12-05T18:00:59Z"
    }]);
  });

  it('lists my orgs and roles', function () {
    cmd.run({
      args: {},
      auth: { username: netrc.login, password: netrc.password }
    }).then(function(stdout) {
      console.log('stdout',stdout);
      assert.equal(stdout, '\norg-name\tadmin\n');
    });
  });
});
