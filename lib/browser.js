var process = require('./process');

var cmds = [
  'get',
  'setHtml',
  'run',
  'runAsync',
  'title',
  'url',
  'html',
  'save',
  'screenshot'
];

exports.createBrowser = function(opts) {
  return new Browser(opts);
};

var Browser = function(opts) {
  this.id = 0;
  this.callbacks = {};
  var connection = this.connection = process.createProcess(opts);
  var self = this;
  connection.on('message', function(rv) {
    if(rv.error) {
      rv.error = new Error(rv.error);
    }
    if(self.callbacks[rv.id] && typeof(self.callbacks[rv.id]) == "function") {
      self.callbacks[rv.id](rv.error, rv.result);
    }
    delete self.callbacks[rv.id];
    if((self.queue && Object.keys(self.callbacks).length == 0) || rv.error) {
      self.exit();    
      if(self.endCallback) { 
        self.endCallback(rv.error, rv.result);
      }
    }
  });
  connection.on('error', function(err) {
    self.exit();
    if(self.endCallback) {
      self.endCallback(err);
    } else {
      throw err;
    }
  });
};

Browser.prototype.__defineGetter__('chain', function() {
  this.queue = [];
  return this;
});

Browser.prototype.command = function(cmd, args) {
  var id = ++this.id;
  this.callbacks[id] = (typeof(args[args.length-1]) == "function") ? args.pop() : true;
  var opts = { 'method' : cmd, 'params' : args, 'id' : id };
  this.queue ? this.queue.push(opts) : this.connection.send(opts);
};

Browser.prototype.end = function(cb) {
  this.endCallback = cb;
  this.connection.send(this.queue);
};

Browser.prototype.exit = function() {
  this.connection.close();
};

cmds.map(function(cmd) {
  Browser.prototype[cmd] = function() {
    var args = Array.prototype.slice.call(arguments);
    if(['run', 'runAsync'].indexOf(cmd) !== -1 && typeof(args[0]) == 'function') {
      args[0] = '('+args[0].toString()+')()';
    }
    this.command(cmd, args);
    return this;
  };
});