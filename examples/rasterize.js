var browserjet = require('../'),
    browser = browserjet.createBrowser();
    
browser
  .chain
  .get(process.argv[2])
  .save(process.argv[3])
  .end(function(err, arg) {
    if(err) { throw err; }
  });