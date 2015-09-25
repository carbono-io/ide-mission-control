'use strict';
module.exports = function (app) {

    var file = app.controllers.file;

    // @todo refactor route to a better name.
    app.ws
        .of('/file')
        .on('connection', function (socket) {
            file.registerEvents(socket);
            file.registerCommands(socket);
        });

    return this;
};
