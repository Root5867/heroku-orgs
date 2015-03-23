exports.topics = [{
  name: '_orgs',
  description: 'CLI for Heroku Organizations'
}];

exports.commands = [
  require('./lib/orgs'),
  require('./lib/apps'),
  require('./lib/access')
];
