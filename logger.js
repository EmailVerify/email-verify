var debug = false

var log = function(level, msg) {
  if(debug) {
    console.log(level + ": " + msg)
  }
}

var logArray = function(level, array) {
  if(debug) {
    for(var i = 0; i < array.length; i++) {
      console.log(level + ": " + array[i])
    }
  }
}

module.exports.logger = {
  info: function(msg) {
    log('INFO', msg)
  },
  error: function(msg) {
    log('ERROR', msg)
  },
  server: function(msg) {
    logArray('SERVER', msg.split("\n"))
  },
  client: function(msg) {
    logArray('CLIENT', msg.split("\n"))
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
