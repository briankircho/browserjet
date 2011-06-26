var spawn = require('child_process').spawn,
    path = require('path'),
    EventEmitter = require('events').EventEmitter;

exports.createProcess = function(opts) {
  return new Process(opts);
};

var Process = function(opts) {
  var self = this;
  var cmd = __dirname+'/../bin/browserjet-bin';
  var buffer = '', pos;
  
  var env = process.env;
  env["LD_LIBRARY_PATH"] = path.resolve(__dirname, "../bin/lib");
  env["QT_QPA_FONTDIR"] = path.resolve(__dirname, "../bin/fonts");
  var args = ['-platform','Headless'];
  var opts = {
    env : env,
    setsid: false,
    customFds: [-1, -1, -1],
  };
  var child = this.child = spawn(cmd, args, opts);
  child.stdout.setEncoding('utf-8');
  child.stdout.on('data', function(data) {
    buffer += data;
    if(buffer.indexOf("\n") != -1) {
      var responses = buffer.split("\n");
      var last = responses.pop();
      buffer = (last) ? last : '';
      responses.forEach(function(response) {
        self.emit('message', JSON.parse(response));
      });
    }
  });
  child.stderr.setEncoding('utf-8');  
  child.stderr.on('data', function(data) {
    process.stderr.write(data);
  });
};
Process.prototype = new EventEmitter;

Process.prototype.send = function(data) {
  if(Array.isArray(data)) {
    var json = data.map(function(item) { 
      return JSON.stringify(item); 
    }).join("\n");
  } else {
    json = JSON.stringify(data);
  }
  this.write(json);
};

Process.prototype.write = function(data) {
  this.child.stdin.write(data+"\n");
};

Process.prototype.close = function() {
  this.child.kill();
};
