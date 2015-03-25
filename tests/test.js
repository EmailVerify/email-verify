var assert = require("assert")

describe('email-verify', function(){
  this.timeout(5000);
  var verifier = require( '../index.js' );

  describe('#verify()', function(){
    it('existing email: should respond with an object where success is true', function(done){
      verifier.verify("rob@below.io", function(err, info){
        assert(info.success);
        done();
      });
    });
    it('non-existing email: should respond with an object where success is false', function(done){
      verifier.verify("antirob@below.io", function(err, info){
        assert(!info.success);
        done();
      });
    });
    it('badly formed email: should respond with an object where success is false', function(done){
      verifier.verify("badlyformed##email@email@.com", function(err, info){
        assert(!info.success);
        done();
      });
    });
    it('short timeout: should respond with an object where success is false', function(done){
      verifier.verify("rob@below.io", { timeout: 1, port: 25 }, function(err, info){
        assert(!info.success);
        done();
      });
    });
    it('long timeout: should respond with an object where success is true', function(done){
      verifier.verify("rob@below.io", { timeout: 5000, port: 25 }, function(err, info){
        assert(info.success);
        done();
      });
    });
    it('bad smtp port: should respond with an object where success is false', function(done){
      verifier.verify("rob@below.io", { port: 587 }, function(err, info){
        assert(!info.success);
        done();
      });
    });

  }); // End Describe #verify()
}); // End Describe email-verify
