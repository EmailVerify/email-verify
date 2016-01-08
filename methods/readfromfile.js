var fs = require('fs');
var _ = require('lodash');

module.exports.getAddressFromTextFile = function(filepath) {
  var addressesString = fs.readFileSync(filepath, 'utf-8');
  var addressesList = addressesString.split("\n");
  var addressesFiltered = _.without(addressesList,'');
  return addressesFiltered;
}