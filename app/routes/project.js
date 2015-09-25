'use strict';
module.exports = function (app) {

    var project = app.controllers.project;

    app.post('/projects', project.create);

    return this;
};
