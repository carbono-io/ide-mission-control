'use strict';
module.exports = function (app) {

    var project = app.controllers.project;

    app.post('/mc/projects', app.authenticate, project.create);

    return this;
};
