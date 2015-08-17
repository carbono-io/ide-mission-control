var dcm = require('../lib/ide-development-container-manager-cli');
var bo  = require('../lib/mission-control-bo');

module.exports = function (app) {
	
    this.list = function(socket){
        socket.on('list', function() {
            var list = dcm.list();
            socket.emit('listed', list);
        });
    };
	/**
     * @TODO Put cm in a user context
     */
    this.create = function(socket){
        socket.on('create', function(proj) {
            bo.createDevContainer(proj, function(err, res, cm){
                if(!err){
                    socket.emit('created', res);
                    app.cm = cm;
                }
            });
        });
    };
      
    return this;
};