'use strict';
module.exports = function (app) {
    var resources = app.controllers.resources;
    var path = '/mc/cm/:projectId';

    app.get(path + '/', resources.root);
    app.get(path + '/marked/[^**/]*', resources.marked);
    app.get(path + '/clean/[^**/]*', resources.clean);

    return this;
};
