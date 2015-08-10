module.exports = function(app) {
	
	var file = app.controllers.file;
	
	this.events = function (socket) {
		file.create(socket);
		file.list(socket);
		file.delete(socket);
		file.apNode(socket);
		file.rmNode(socket);
		file.edNodeAtt(socket);
    };
	
    return this;
};