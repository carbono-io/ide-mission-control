'use strict';
var request = require('request');
var io = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Creates a connection to a code machine instance. The connection's instance
 * proxies websocket events through an event emitter. CM.prototype.commands
 * lists all events the code machine listens to, and which can be emitted
 * through the connection instance. CM.prototype.events lists all events the
 * code machine may emit (and to which the mission control may add listeners to
 * the event emitter).
 *
 * @class CM
 * @param {Object} container - represents the code machine instance.
 * @param {string} container.markedURL - URL where the CM serves marked files.
 * @param {string} container.cleanURL - URL where the CM serves clean files.
 * @param {string} container.wsURL - URL for websocket connection to the CM.
 */
var CM = function (container) {
    this.container = container;

    if (!this.container.markedURL) {
        throw 'Container must contain marked url.';
    }

    if (!this.container.cleanURL) {
        throw 'Container must contain clean url.';
    }

    this.ws = io.connect(container.wsURL);

    this.ws.on('connect', function () {
        for (var i in this.events) {
            var ev = this.events[i];
            this.ws.on(ev, this.emit.bind(this, ev));
        }
        for (i in this.requests) {
            ev = this.requests[i];
            this.ws.on(ev, this.emit.bind(this, ev));
        }
    }.bind(this));

    for (var i in this.commands) {
        var cmd = this.commands[i];
        this.on(cmd, this.ws.emit.bind(this.ws, cmd));
    }

    EventEmitter.call(this);
    return this;
};

util.inherits(CM, EventEmitter);

// Events which the code machine is listening to. May be emitted in the instance
CM.prototype.commands = [
    'command:insertElement',
    'command:createEntityFromSchema',
    'command:bindComponentToEntity',

];

// Events which the code machine may emit. Will be re-emitted in the instance
CM.prototype.events = [
    'control:contentUpdate',
    'status:success',
    'status:failure',
    'command:insertElement/success',
    'command:insertElement/error',
    'command:createEntityFromSchema/success',
    'command:createEntityFromSchema/error',
    'command:bindComponentToEntity/success',
    'command:bindComponentToEntity/error',
];

// Requests are emitted by the code machine. but should be intercepted and
// treated by the mission control.
CM.prototype.requests = [
    'project:createMachine',
];

/**
 * Handles request for a Marked file
 *
 * @param {Object} req - Request object
 * @param {string} req.url - Path for the file
 * @param {Object} res - Response containing the requested file
 */
CM.prototype.marked =  function (req, res) {
    var cmURL = this.container.markedURL + req.url;
    req.pipe(request(cmURL)).pipe(res);
};

/**
 * Handles request for a Clean file
 *
 * @param {Object} req - Request object
 * @param {string} req.url - Path for the file
 * @param {Object} res - Response containing the requested file
 */
CM.prototype.clean =  function (req, res) {
    var cmURL = this.container.cleanURL + req.url;
    req.pipe(request(cmURL)).pipe(res);
};

module.exports = CM;
