var fs = require('fs');
var _ = require('lodash');

module.exports.getAddressFromTextFile = function(filepath) {
  var file = { exist: true, extension: '' };

  file.exist = true;
  file.extension = require('path').extname(filepath);

  try {
    var fileContent = fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') console.log('File not found!');
    else console.log('Error: ', e);
    file.exist = false;
  } finally {

    if (!file.exist || e.code === 'ENOENT') {
      // if file is not found, do not run this!
      console.log('Error, File not found!');
    } else {
      var addressList = fileContent.split("\n");
      var addressesFiltered = _.without(addressList,'');
      return addressesFiltered;
    }

  }
}

// TODO: Check again