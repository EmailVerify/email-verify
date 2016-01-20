var fs = require('fs');
var _ = require('lodash');

module.exports.getAddressFromTextFile = function(filepath) {
  var file = { exist: true, extension: '' };
  var extensionErrorMsg = "Sorry, you needed to put addresses list into plain text (*.txt) file." +
                          " Separated each address by new line";

  file.exist = true;
  file.extension = require('path').extname(filepath);

  if (file.extension !== '.txt') throw new Error(extensionErrorMsg);

  try {
    var fileContent = fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') console.log('File not found!');
    else console.log('Error: ', e);
    file.exist = false;
  } finally {

    if (!file.exist) {
      console.log('Error, File not found!');
    } else {
      var addressList = fileContent.split("\n");
      var addressesFiltered = _.without(addressList,'');
      return addressesFiltered;
    }

  }
}