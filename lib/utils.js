var columnify   = require('columnify');

var printData = function (data) {
  console.log(columnify(data, { showHeaders: false, columnSplitter: '\t' }));
}

var getOwner = function(owner) {
  if (isOrgApp(owner)) {
    return owner.split('@herokumanager.com')[0];
  }
  return owner;
}

var isOrgApp = function (owner) {
  return (/herokumanager\.com$/.test(owner));
}

module.exports.printData = printData;
module.exports.getOwner = getOwner;
module.exports.isOrgApp = isOrgApp;
