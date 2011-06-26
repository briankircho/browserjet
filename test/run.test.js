var browserjet = require('../lib/browser'),
    assert = require('assert');

module.exports = {
  'test run' : function() {
    var browser = browserjet.createBrowser();
    browser
      .chain
      .run("1+1", function(err, result) {
        assert.equal(result, 2, "Incorrect numeric return result");
      })
      .run("document.body.innerHTML='brian';")
      .run("document.body.innerHTML", function(err, result) {
        assert.equal(result, 'brian', "Incorrect string return result");
      })
      .run(function() { 
        return 1+1; 
      }, function(err, result) {
        assert.equal(result, 2);
      })
      .end(function(err) {
        assert.ifError(err);
      });
  },
  'test runAsync' : function() {
    var browser = browserjet.createBrowser();
    browser
      .chain
      .runAsync("browserjet.callback(true);", function(err, result) {
        assert.ok(result, "Unexpected return result");
      })
      .runAsync("setTimeout(function() { browserjet.callback(2); }, 50);", function(err, result) {
        assert.equal(result, 2, "Incorrect numeric return result");
      })
      .runAsync(function() {
        browserjet.callback(true);
      })
      .end(function(err) {
        assert.ifError(err);
      });
  }
};