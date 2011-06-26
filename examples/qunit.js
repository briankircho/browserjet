/* 
 * This example runs qunit tests in a headless browser and outputs the results for example:
 * node qunit.js http://swarm.jquery.org/git/jquery/test/?filter=core
 */ 
var browserjet = require('../'),
    browser = browserjet.createBrowser();

browser
  .chain
  .get(process.argv[2])
  .runAsync(function() {
    // This code is in the browser running qunit
    var start = new Date();
    var waitForTestComplete = function() {
      if(document.querySelector('#qunit-testresult span.passed')) {
        // When browserjet.callback is run, it returns to our node.js callback
        browserjet.callback(document.getElementById('qunit-testresult').innerText);
      }
      setTimeout(waitForTestComplete, 50);
    };
    waitForTestComplete();
    setTimeout(function() {
      browserjet.callback("Test timed out");
    }, 5000);
  }, function(err, result) {
    console.log(result);
  })
  .end(function(err) {
    if(err) { throw err; }
  });
