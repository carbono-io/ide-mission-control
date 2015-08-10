module.exports = function(app) {
	
	var project	= app.controllers.project;
	
	this.events = function (socket) {
		project.create(socket);
		project.list(socket);
		project.fetch(socket);
    };
	
    return this;
};