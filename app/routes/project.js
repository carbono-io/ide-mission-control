module.exports = function(app) {
	
	var project	= app.controllers.project;
	
	app.ws
		.of('/project')
        .on('connection', function (socket) {
			project.create(socket);
			project.list(socket);
	});

    app.get('/new', function(req, res) {
    	var promiseFind = serviceManager.findService('dcm');

    	promiseFind
    		.then(function (v) {
    			res.json({value: v});
    		}, function (err) {
    			res.json({error: err});
    		});
    });
	
    return this;
};