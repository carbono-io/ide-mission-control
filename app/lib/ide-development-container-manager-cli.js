'use strict';
var request = require('request');
var CJM = require('carbono-json-messages');

/**
 * Lista project Ids created. MOCK
 *
 * @todo Needs real implementation
 * @return {Object} object containing a list (containers) of objects
 * (name and uuid)
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
 * @todo Parse errors and throw them.
 * @todo Use carbono-json-messages
 *
 * @param {string} dcmURL - URL retrieved from etcd.
 * @param {string} proj - Id of the project
 * @param {onbject} cb - Callback function that receives errors and/or
 * other information
 *
 * @return function (err, res)
 */
exports.create = function (dcmURL, proj, cb) {
    if (dcmURL) {
        var url = 'http://' + dcmURL + 'container';
        var headers = {
            'Content-Type': 'application/json',
        };
        var aux = {
            apiVersion: '1.0',
            id: '23123-123123123-12312',
            data: {
                id: '1234',
                items:
                [
                    {
                        projectId: proj,
                    },
                ],
            },
        };
        var load = {
                url: url,
                headers: headers,
                json: aux,
            };

        /**
         * Callback function that tries to parse (JSON) the body object
         *
         * @param {Object} err - Error object
         * @param {Object} httpResponse - Response object
         * @param {string} body - String containing a JSON structure
         */
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
        // If there is no DCM reference, nothing can be done. Error
        var cjm = new CJM({apiVersion: '1.0'});
        try {
            var err = {
                   code: 400,
                   message: 'dcmURL is required for this operation',
               };
            cjm.setError(err);
            cb(cjm, null);
        } catch (e) {
            cb(e, null);
        }
    }
};
