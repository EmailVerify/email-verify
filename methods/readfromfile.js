var fs = require('fs');
var _ = require('lodash');

module.exports.getAddressFromTextFile = function(filepath) {
  var fileContent = fs.readFileSync(filepath, 'utf-8');
  var addressList = fileContent.split("\n");
  var addressesFiltered = _.without(addressList,'');
  return addressesFiltered;
}