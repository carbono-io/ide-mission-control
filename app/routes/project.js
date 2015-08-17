module.exports = function(app) {
	
	var project	= app.controllers.project;
	
	app.ws
		.of('/project')
        .on('connection', function (socket) {
			project.create(socket);
			project.list(socket);
	});
	
    return this;
};