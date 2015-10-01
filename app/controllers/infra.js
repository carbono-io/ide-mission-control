'use strict';

var CJM   = require('carbono-json-messages');
var uuid  = require('node-uuid');
var bo    = require('../lib/mission-control-bo');
var pjson = require('../../package.json');
var etcd  = require('carbono-service-manager');

module.exports = function (app) {

    this.createContainer = function (req, res) {

        var projectId = req.body.projectId;
        var machineAlias = req.body.machineAlias;
        var cjm = null;
        var error = null;

        // Check data consistency
        // @todo Create an definitive helper for handling errors.
        //       There are too much repeated code in the repositories.
        if (!projectId || !machineAlias) {
            cjm = new CJM({apiVersion: pjson.version});
            res.status(400);
            error = {
                   code: 400,
                   message: 'Missing mandatory parameters',
                   errors:
                    'projectId and machineAlias should have an valid value',
               };
            cjm.setError(error);
            res.json(cjm);
            res.end();
            return;
        }

        // Get the IPE module URL
        var ipeURL = etcd.getServiceUrl('ipe');
        if (!ipeURL) {
            cjm = new CJM({apiVersion: pjson.version});
            error = {
                   code: 500,
                   message: 'Internal data is missing',
                   errors:
                'ipeURL is not set in etcdManager, I can\'t send the request!',
               };
            res.status(500);
            cjm.setError(error);
            res.json(cjm);
            res.end();
            return;
        }

        // Now we can make the call to the business object.
        bo.createUserContainer(ipeURL, projectId, machineAlias,
            /**
             * Callback function
             */
            function (err, ret) {
                var cjm = new CJM({apiVersion: pjson.version});
                try {
                    if (err) {
                        res.status(400);
                        var error = {
                               code: 400,
                               message: 'Could not create container',
                               errors: err,
                           };
                        cjm.setError(error);
                    } else {
                        // Probably an empty answer, but let's send it anyway
                        cjm.setData(
                           {
                               id: uuid.v4(),
                               items: [ret],
                           }
                        );
                    }
                    res.json(cjm);
                    res.end();
                } catch (e) {
                    // Unknown error...
                    var error = {
                        code: 500,
                        message: 'Unknown internal error',
                        errors: e,
                    };
                    cjm.setError(error);
                    res.json(cjm);
                    res.status(500).end();
                }
            }
        );
    };

    return this;
};