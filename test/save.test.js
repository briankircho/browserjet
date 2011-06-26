var browserjet = require('../lib/browser'),
    assert = require('assert'),
    fs = require('fs');

module.exports = {
  'test save' : function() {
    var tmpName = "/tmp/test-"+new Date().getTime()+"-"+Math.floor(Math.random()*1000000);
    var testHtml = "<html><head></head><body>Hello World!</body></html>";
    var browser = browserjet.createBrowser();
    browser
      .chain
      .setHtml(testHtml)
      .save(tmpName+".png")
      .save(tmpName+".pdf")
      .end(function(err) {
        assert.ifError(err);
        fs.readFile(tmpName+".png", function (err, data) {
          assert.ifError(err);
          assert.equal(data.slice(1,4).toString(), "PNG", "PNG does not appear valid");
          fs.unlink(tmpName+".png");          
        });
         fs.readFile(tmpName+".pdf", function (err, data) {
          assert.ifError(err);
          assert.equal(data.slice(1,4).toString(), "PDF", "PDF does not appear valid");
          fs.unlink(tmpName+".pdf");
        });       
      });
  }
};
