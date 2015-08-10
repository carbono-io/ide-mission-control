var cm = require('../lib/code-machine-cli');

module.exports = function (app) {
	
    this.create = function(socket){
        socket.on('create', function() {
            var file = cm.create();
            socket.emit('created', file);
        });
    };
    
    this.list = function(socket){
        socket.on('list', function() {
            var list = cm.list();
            socket.emit('listed', list);
        });
    };
	
    this.delete = function(socket){
        socket.on('delete', function() {
            var res = cm.del();
            socket.emit('deleted', res);
        });
    };
     
    this.apNode = function(socket){
        socket.on('apNode', function() {
            var node = cm.apNode();
            socket.emit('added', node);
        });
    };
     
    this.rmNode = function(socket){
        socket.on('rmNode', function() {
            var res = cm.rmNode();
            socket.emit('removed', res);
        });
    };
    
    this.edNodeAtt = function(socket){
        socket.on('edNodeAtt', function() {
            var res = cm.edNodeAtt();
            socket.emit('changed', res);
        });
    };
    return this;
};