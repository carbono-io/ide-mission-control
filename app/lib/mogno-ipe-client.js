'use strict';
var request = require('request');
var Message = require('carbono-json-messages');

var createMachine = function (ipeURL, component, route, cb) {
    var reqURL = ipeURL + 'machines/';
    var headers = {
        'Content-Type': 'application/json',
    };
    var message = new Message({apiVersion: '1.0'});

    message.setData({
        items: [
            {
                component: component,
                route: route,
                environment: 'HOM',
            },
        ],
    });

    var payload = {
        url: reqURL,
        headers: headers,
        json: message.toJSON(),
    };

    request.post(payload, function (err, response, body) {
        try {
            body = JSON.parse(body);
        } catch (err) {
            this.err = err;
        }
        cb(err, body);
    });
};

module.exports = {
    createMachine: createMachine,
};
