'use strict';
module.exports = function (app) {
    var infra = app.controllers.infra;

	app.post('/createContainer', infra.createContainer);
	
    return this;
};
