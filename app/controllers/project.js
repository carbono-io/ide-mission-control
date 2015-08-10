var dcm = require('../lib/ide-development-container-manager-cli');

module.exports = function (app) {
	
    this.list = function(socket){
        socket.on('list', function() {
            var list = dcm.list();
            socket.emit('listed', list);
        });
    };
	
    this.create = function(socket){
        socket.on('create', function() {
            var container = dcm.create();
            socket.emit('created', container);
        });
    };
	
    this.fetch = function(socket){
        socket.on('fetch', function() {
            var container = dcm.fetch();
            socket.emit('retrieved', container);
        });
    };
      
    return this;
};