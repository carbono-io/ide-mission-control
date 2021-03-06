'use strict';
module.exports = function (app) {
    var resources = app.controllers.resources;
    var path = '/projects/:projectId/resources';

    app.get('/', app.authenticate, resources.root);
    app.get(path + '/marked/[^**/]*', app.authenticate, resources.marked);
    app.get(path + '/clean/[^**/]*', app.authenticate, resources.clean);
    app.get(path + '/gui', app.authenticate, resources.gui);
    app.get(path + '/cli', app.authenticate, resources.cli);

    return this;
};
