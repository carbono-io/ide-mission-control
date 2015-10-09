'use strict';
var request = require('request');
var CJM = require('carbono-json-messages');
var pjson = require('../../package.json');

/**
 * Creates and/or retrieves an docker instance and
 * returns a callback function.
 *
 * @todo Parse errors and throw them.
 * @todo Use carbono-json-messages
 *
 * @param {string} ipeURL - URL retrieved from etcd.
 * @param {string} proj - Id of the project
 * @param {onbject} cb - Callback function that receives errors and/or
 * other information
 *
 * @return function (err, res)
 */
exports.create = function (ipeURL, proj, alias, cb) {
    if (ipeURL) {
        var url = 'http://' + ipeURL + '/container';
        var headers = {
            'Content-Type': 'application/json',
        };
        var aux = {
            apiVersion: pjson.version,
            id: 'xyzzy-wyzzy',
            data: {
                id: '1337',
                items:
                [
                    {
                        projectId: proj,
                        machineAlias: alias,
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
        // If there is no IPE reference, nothing can be done. Sends an Error.
        var cjm = new CJM({apiVersion: pjson.version});
        try {
            var err = {
                   code: 400,
                   message: 'ipeURL is required for this operation',
               };
            cjm.setError(err);
            cb(cjm, null);
        } catch (e) {
            cb(e, null);
        }
    }
};
