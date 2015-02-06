var Table   = require('cli-table');

module.exports = function(options) {
  var table = new Table({
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
       , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
       , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
       , 'right': '' , 'right-mid': '' , 'middle': ' ' }
  });

  for (var attrname in options) {
    table.options[attrname] = options[attrname];
  }

  return table;
};
