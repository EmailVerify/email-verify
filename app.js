process.argv.forEach(function (val, index, array) {
  if( index > 1 ){
    var verifier = require( './index.js' );
    verifier.verify(val, function(info,err){
        if( err ) console.log(err);
        else console.log(info);
    });
  }
});
