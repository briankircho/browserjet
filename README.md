Browserjet - headless webkit with a node.js interface
================================================================
Browserjet gives you access to headless webkit which is often useful 
for site scraping, testing, page screenshots, saving pdfs, and more.

Installing
--------------------------------------
To install the node.js module simply use
```javascript
npm install browserjet
```
     
Currently supported is Linux 32/64

Usage
--------------------------------------
Browserjet provides and easy to use API.  To load, manipulate, and save a page as a png you can use:
```javascript
var browserjet = require('browserjet'),
    browser = browserjet.createNewBrowser();
    
browser
  .chain
  .get("http://nodejs.org/")
  .run(function() {
    document.body.style.backgroundColor = '#000066';
  })
  .save('nodejs.png')
  .end(function(err) {
    if(err) { throw err; }
  });
```

API
--------------------------------------
### browser.get(url, callback)
Fetch the given page and pass ok to callback after completely loaded
```javascript
browser.get("http://google.com/", function(err, ok) {
  if(err) { throw err; }
  console.log("Page loaded");
});
```
Also see examples/loadspeed.js for another example

### browser.setHtml(html, callback)
Set the browsers content to the given HTML and run callback when completely loaded
```javascript
browser.setHtml("<html><body>Hello World</body></html>");
```

### browser.html(callback)
Return the browsers HTML

### browser.run(js, callback)
Run the supplied javascript synchronously in the context of the currently loaded page
and pass the last result to the callback
```javascript
browser.run("document.getElementsByTagName('p').length", function(err, count) {
  console.log("There are "+count+" paragraphs in the currently loaded page");
});
```
    
### browser.runAsync(js, callback)
An advanced command to run the given javascript asynchronously in the context of the currently
loaded page, browserjet.callback is exposed on the page and returns its parameter to the callback.
```javascript
    browser.runAsync(function() {
      // This code runs in the context of the loaded page
      setTimeout(function() {
        browserjet.callback(document.title);
      }, 1000);
    }, function(err, title) {
      console.log(title);
    });
```
After 1s, the title of the currently loaded page is printed
Also see examples/qunit.js for another example of runAsync

### browser.save(filename, callback)
Saves the current page, supported file extensions are image formats (png, gif, svg, tiff) and pdf
```javascript
browser.save("page.pdf");
browser.save("/tmp/page.png");
```

Tests
--------------------------------------
The browserjet tests use expresso, which you can install with
```javascript
npm install -g expresso
```

Then in the module directory you can just run
```javascript
expresso
```
       
