exports.topics = [{
  name: '_orgs',
  description: 'CLI for Heroku Organizations'
}];

exports.commands = [
  require('./lib/commands/orgs/list'),
  require('./lib/commands/apps/list'),
  require('./lib/commands/access/list')
];
