let fs = require('fs')

module.exports.getAddressFromTextFile = function(filepath) {
  let file = { 
    exist: true, 
    extension: require('path').extname(filepath),
    content: ''
  }

  let extensionErrorMsg = 'Sorry, you needed to put addresses list into plain text (*.txt) file. Separated each address by new line'

  if(file.extension !== '.txt') throw new Error(extensionErrorMsg)

  try {
    file.content = fs.readFileSync(filepath, 'utf-8')
  } 
  catch (e) {
    if (e.code === 'ENOENT') console.log('File not found!',e)
    else console.log('Error: ', e)
    file.exist = false;
  } 
  finally {

    if (!file.exist) {
      console.log('Error, File not found!')
      return []
    } 
    else {
      let addressList = file.content.split('\n'),
          addressObject = {}

      addressList.forEach((address)=>{
        if(address.length > 0){
          addressObject[address] = true
        }
      })

      return Object.keys(addressObject)
    }

  }
}