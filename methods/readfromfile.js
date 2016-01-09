var fs = require('fs');
var _ = require('lodash');

module.exports.getAddressFromTextFile = function(filepath) {
  var isExist = true;
  try {
    var fileContent = fs.readFileSync(filepath, 'utf-8');
  } catch (e){
    if (e.code === 'ENOENT') console.log('File not found!');
    else console.log('Another error: ', e);
    isExist = false;
  }
  finally {

    // if file is not found, do not run this!
    if (!isExist) {
      throw new Error("SOMETHING BROKE")
    } else {
      var addressList = fileContent.split("\n");
      var addressesFiltered = _.without(addressList,'');
      return addressesFiltered;
    };
  }
}

// TODO: Clean up, if posible