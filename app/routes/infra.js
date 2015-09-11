'use strict';
module.exports = function (app) {
    var infra = app.controllers.infra;

	app.get('/createContainer', infra.createContainer);
	
    return this;
};
