'use strict';
module.exports = function (app) {
    var resources = app.controllers.resources;
    var path = '/mc/cm/:projectId';

    app.get(path + '/', app.authenticate, resources.root);
    app.get(path + '/marked/[^**/]*', app.authenticate, resources.marked);
    app.get(path + '/clean/[^**/]*', app.authenticate, resources.clean);

    return this;
};
