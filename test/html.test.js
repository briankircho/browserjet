var browserjet = require('../lib/browser'),
    assert = require('assert');

module.exports = {
  'test html setting' : function() {
    var default_html = '<html><head></head><body></body></html>';
    var test_html = '<html><head></head><body>Browserjet FTW</body></html>';
    var browser = browserjet.createBrowser();
    browser
      .chain
      .html(function(err, html) {
        assert.equal(html, default_html, 'Unexpected default HTML');
      })
      .setHtml(test_html, function(err, result) {
        assert.ok(result, "setHtml command should return true");
      })
      .html(function(err, html) {
        assert.equal(html, test_html, "Incorrect html after setHtml");
      })
      .end(function(err, lastResult) {
        assert.ifError(err);
      });
  }
};