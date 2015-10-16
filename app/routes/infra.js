'use strict';
module.exports = function (app) {
    var infra = app.controllers.infra;

    app.post('/createContainer', app.authenticate, infra.createContainer);

    return this;
};
