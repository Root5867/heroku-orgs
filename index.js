var exec = require('child_process').exec;
var child;

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
      child = exec('heroku orgs',
        function (error, stdout, stderr) {
          console.log(stdout);
          if (error !== null) {
            console.log('stderr: ' + stderr);
            console.log('exec error: ' + error);
          }
      });
    }
  }
];
