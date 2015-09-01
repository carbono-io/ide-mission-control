'use strict';
var config  = require('config');
var request = require('request');
var CJR = require('carbono-json-response');

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
 * 
 * @param {string} dcmURL - URL retrieved from etcd.
 * 
 * @todo Parse errors and throw them.
 * @return function (err, res)
 */
exports.create = function (dcmURL, proj, cb) {
    if (dcmURL) {
        var url = dcmURL + '/container';
        var headers = {
        'Content-Type':     'application/json'
        };
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

    } else {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            var err = {
                   code: 400,
                   message: 'dcmURL is required for this operation',
               };
            cjr.setError(err);
            cb(cjr, null);
        } catch (e) {
            cb(e, null);
        }
    }
};
