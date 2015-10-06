'use strict';

module.exports = function (app) {

    /**
     * On connection, register listeners to commands that the client (IDE) may
     * emit to the code machine, and re-emits them to the CM connection.
     */
    this.registerCommands = function (socket) {
        if (!app.cm) {
            console.log('No instance of Code Machine found!');
            return;
        }

        app.cm.commands.forEach(function (cmd) {
            socket.on(cmd, app.cm.emit.bind(app.cm, cmd));
        });
    };

    /**
     * On connection, register listeners to events that the code machine may
     * emit, and re-emits them to the socket with client (IDE).
     */
    this.registerEvents = function (socket) {
        if (!app.cm) {
            console.log('No instance of Code Machine found!');
            return;
        }

        app.cm.events.forEach(function (ev) {
            var listener = socket.emit.bind(socket, ev);

            app.cm.on(ev, listener);
            socket.on('disconnect', function () {
                app.cm.removeListener(ev, listener);
            });
        });
    };

    return this;
};
