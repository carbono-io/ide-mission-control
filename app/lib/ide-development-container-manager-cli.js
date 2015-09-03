'use strict';
var request = require('request');
var CJR = require('carbono-json-response');

/**
 * Lista project Ids created. MOCK
 * 
 * @todo Needs real implementation
 * @return {object} object containing a list (containers) of objects 
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
 * @param {String} dcmURL - URL retrieved from etcd.
 * @param {String} proj - Id of the project
 * @param {create-callback} cb - Callback function that receives errors and/or
 * other information
 * 
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
        
        /**
         * Callback function that tries to parse (JSON) the body object
         * 
         * @param {object} err - Error object
         * @param {object} httpResponse - Response object
         * @param {String} body - String containing a JSON structure
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
