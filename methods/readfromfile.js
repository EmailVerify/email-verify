var fs = require('fs');
var _ = require('lodash');

module.exports.getAddressFromTextFile = function(filepath) {
  var file = { isExist: true, extension: '' };

  file.isExist = true;
  file.extension = require('path').extname(filepath);

    console.log("extension: ", file.extension);
    if (file.extension === '.txt')  console.log('It\'s text');
    else console.log('it\'s not text');

    // forced throw error, check extension
    throw new Error('forced throw error, check extension');

  try {
    var fileContent = fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') console.log('File not found!');
    else console.log('Error: ', e);
    file.isExist = false;
  } finally {
    if (!file.isExist) {
      // if file is not found, do not run this!
      throw new Error("SOMETHING BROKE")
    } else {
      var addressList = fileContent.split("\n");
      var addressesFiltered = _.without(addressList,'');
      return addressesFiltered;
    };
  }
}

// TODO: Clean up, remove forced throw error.