exports.topics = [{
  name: '_orgs',
  description: 'CLI for Heroku Organizations'
}];

exports.commands = [
  {
    topic: '_orgs',
    command: 'list',
    description: 'Lists the organizations you are a member of',
    help: 'Example: heroku _orgs:list',
    run: function () {
      console.log('# TODO: Do what it\'s expected');
    }
  }
];
