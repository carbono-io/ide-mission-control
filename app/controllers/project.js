'use strict';

var bo             = require('../lib/mission-control-bo');
var uuid           = require('node-uuid');
var AccountManager = require('../lib/AccountManagerHelper');
var etcd           = require('carbono-service-manager');

module.exports = function (app) {
    var RequestHelper = require('../lib/RequestHelper');
    var reqHelper = new RequestHelper();
    /**
     * Handles request for the creation of a project. This will communicate
     * with DCM to create a new project and get the reference of the CM
     * @todo Put cm in a user context
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.create = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            if (reqHelper.checkMessageStructure(req)) {
                var userData = req.body.data.items[0];
                userData.owner = req.user.emails[0].value;
                var missingProperties =
                    reqHelper.checkRequiredData(
                        userData, ['owner', 'name', 'description']);
                if (missingProperties.length) {
                    var errMessage = '';
                    missingProperties.forEach(function (prop) {
                        errMessage += 'Malformed request: ' + prop +
                        ' is required.\n';
                    });
                    reqHelper.createResponse(res, 400, errMessage);
                } else {
                    try {
                        // Discovers with etcdManager the ACCM URL
                        var accmURL = etcd.getServiceUrl('accm');
                        var accm = new AccountManager(accmURL);
                        // Discover correct projectId
                        accm.createProject(userData).then(
                            function (project) {
                                var projectId = project.code;
                                // Calls DCM to create the machine
                                // Discovers with etcdManager the DCM URL
                                var dcmURL = etcd.getServiceUrl('dcm');
                                bo.createDevContainer(dcmURL, projectId,
                                    /**
                                     * Callback function for the creation of
                                     * a project on DCM
                                     * @param {Object} err - Error object
                                     * containing any errors
                                     * @param {Object} ret - Return values
                                     * from the method
                                     * @param {string} ret.markedURL - Path
                                     * for Marked files
                                     * @param {string} ret.srcURL - Path for
                                     * Clean files
                                     * @param {Object} cm - Code Machine
                                     * reference
                                     */
                                    function (err, ret, cm) {
                                        try {
                                            if (err) {
                                                reqHelper.createResponse(res,
                                                    400,
                                                    ['Could not create project',
                                                    err,].join(' - '));
                                            } else {
                                                app.cm = cm;
                                                reqHelper.createResponse(res,
                                                    201,
                                                    {
                                                        id: uuid.v4(),
                                                        items: [ret],
                                                    });
                                            }
                                        } catch (e) {
                                            reqHelper.createResponse(res,
                                                500, e);
                                        }
                                    }
                                );
                            },
                            function (error) {
                                reqHelper.createResponse(res, error.code,
                                    error.message);
                            }
                        );
                    } catch (e) {
                        reqHelper.createResponse(res, 500,
                            e);
                    }
                }
            } else {
                reqHelper.createResponse(res, 400, 'Malformed request');
            }
        } else {
            reqHelper.createResponse(res, 400,
                'Malformed request');
        }
    };

    return this;
};
