var process = require('../lib/process'),
    assert = require('assert');

module.exports = {
  'test send object' : function(beforeExit) {
    var connection = process.createProcess();
    var n = 0;
    connection.on('message', function(msg) {
      assert.equal(msg.id, 1, 'id should be 1');
      assert.ifError(msg.error);
      assert.ok(msg.result, 'result should be trueish');
      n++;
      connection.close();
    });
    connection.send({'method' : 'html', 'params' : [], 'id' : 1});
    beforeExit(function() {
      assert.equal(1, n, 'Message should be recieved');
    });
  },
  'test send array' : function() {
    var cmds = [];
    for(var i=1; i<=5; i++) {
      cmds.push({'method' : 'html', 'params' : [], 'id' : i});
    }
    var connection = process.createProcess();
    var n = 1;
    connection.on('message', function(msg) {
      assert.equal(msg.id, n, 'id should be '+n);
      assert.ifError(msg.error);      
      assert.ok(msg.result, 'result should be trueish');
      n++;
      if(n == 5) {
        connection.close();
      }
    });
    connection.send(cmds);
  },  
  'test invalid JSON' : function() {
    var connection = process.createProcess();
    connection.on('message', function(msg) {
      assert.equal(msg.error, 'Unknown Command');
      connection.close();
    });
    connection.write('invalid json');
  }
};