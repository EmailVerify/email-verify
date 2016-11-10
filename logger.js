var debug = false

var log = function(level, msg) {
  if(debug) {
    console.log(level + ": " + msg)
  }
}

module.exports.logger = {
  info: function(msg) {
    log('INFO', msg)
  },
  error: function(msg) {
    log('ERROR', msg)
  }
}

module.exports.loggerOptions = {
  enable: function() {
    debug = true
  },
  disable: function() {
    debug = false
  }
}
