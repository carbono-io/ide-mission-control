'use strict';
module.exports = function (app) {

    var project = app.controllers.project;

    app.post('/projects', app.authenticate, project.create);

    return this;
};
