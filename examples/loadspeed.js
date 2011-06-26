var browserjet = require('../'),
    browser = browserjet.createBrowser();

var start = new Date();
browser.get(process.argv[2], function(err, ok) {
  if(err) { throw err; }
  console.log("Loading "+process.argv[2]+" took "+(new Date()-start)+"ms");
  browser.exit();
});
