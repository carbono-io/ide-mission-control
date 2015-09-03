'use strict';
module.exports = function (app) {

    var project = app.controllers.project;

    app.post('/project', project.create);
    app.get('/project/:projectId', project.retrieve);
    app.get('/project', project.list);

    return this;
};
