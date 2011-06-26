/**
 * Screenshot HTTP Service
 * A simple server using browserjet to serve webpages as PNG images
 *
 * Usage: http://localhost:8080/?url=http://google.com/
 */

var browserjet = require('../'),
    http = require('http'),
    url = require('url'),
    fs = require('fs');
    
var SERVER_PORT = 8080,
    PROCESS_COUNT = 4,
    CACHE_DIR = '/tmp/screenshots';

var browsers = [], connections = [];
for(var i=0; i<PROCESS_COUNT; i++) {
  browsers.push(browserjet.createBrowser({
    cache_dir : CACHE_DIR
  }));
}
function handleConnection() {
  if(connections.length == 0 || browsers.length == 0) { return; }
  
  var connection = connections.shift()
      req = connection[0], res = connection[1],
      query = url.parse(req.url, true).query,
      browser = browsers.shift(),
      imgFile = CACHE_DIR+'/'+new Date().getTime()+'-'+Math.floor(Math.random()*1000000)+'.png';
  
  browser.get(query.url, function(err, ok) {
    browser.save(imgFile, function(err, data) {      
      browsers.push(browser);
      setTimeout(handleConnection, 0);

      res.writeHead(200, { 'Content-Type': 'image/png' });      
      fs.createReadStream(imgFile, {
        'bufferSize': 4 * 1024
      }).on('close', function() {
        fs.unlink(imgFile);
      }).pipe(res);
    });
  });
}
http.createServer(function (req, res) {
  connections.push([req, res]);
  handleConnection();
}).listen(SERVER_PORT);
console.log("Screenshot server listening on port "+SERVER_PORT);