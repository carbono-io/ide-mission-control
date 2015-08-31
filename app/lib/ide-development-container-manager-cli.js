'use strict';
var config  = require('config');
var request = require('request');
/**
 * List project Ids created. MOCK
 */
exports.list = function () {
    return {
        containers: [
            {name: 'a', uuid: 1},
            {name: 'b', uuid: 2},
        ],
    };
};

/**
 * Creates and/or retrieves an docker instance and
 * returns a callback function.
 * @todo Parse errors and throw them.
 * @return function (err, res)
 */
exports.create = function (proj, cb) {
    var url = config.get('dcmURL') + '/container';
    var headers = {
    'Content-Type':     'application/json'
}
    var aux = {
        apiVersion:'1.0',
        id:'23123-123123123-12312',
        data: {
            id: '1234', 
            items: 
            [
                {
                    projectId: proj
                    
                }
            ]
        }};
    var load = {
        url: url,
        headers: headers,
        json: aux
        };
    var _cb = function (err, httpResponse, body) {
        try {
            body = JSON.parse(body);
        } catch (err) {
            this.err = err;
        }
        cb(err, body);
    };
    request.post(load, _cb);
};
