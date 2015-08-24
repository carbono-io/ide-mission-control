'use strict';

/**
 * @todo Get cm from user context
 */
module.exports = function (app) {

    this.create = function (socket) {
        if (!app.cm) {
            return;
        }
        socket.on('create', function () {
            var file = app.cm.create();
            socket.emit('created', file);
        });
    };

    this.list = function (socket) {
        if (!app.cm) {
            return;
        }
        socket.on('list', function () {
            var list = app.cm.list();
            socket.emit('listed', list);
        });
    };

    this.delete = function (socket) {
        if (!app.cm) {
            return;
        }
        socket.on('delete', function () {
            var res = app.cm.del();
            socket.emit('deleted', res);
        });
    };

    this.apNode = function (socket) {
        if (!app.cm) {
            return;
        }
        socket.on('apNode', function () {
            var node = app.cm.apNode();
            socket.emit('added', node);
        });
    };

    this.rmNode = function (socket) {
        if (!app.cm) {
            return;
        }
        socket.on('rmNode', function () {
            var res = app.cm.rmNode();
            socket.emit('removed', res);
        });
    };

    this.edNodeAtt = function (socket) {
        if (!app.cm) {
            return;
        }
        socket.on('edNodeAtt', function () {
            var res = app.cm.edNodeAtt();
            socket.emit('changed', res);
        });
    };
    return this;
};
