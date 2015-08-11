module.exports = function(app) {
	
	var file = app.controllers.file;

	app.ws
		.of('/file')
        .on('connection', function (socket) {
			file.create(socket);
			file.list(socket);
			file.delete(socket);
			file.apNode(socket);
			file.rmNode(socket);
			file.edNodeAtt(socket);
    });
	
    return this;
};