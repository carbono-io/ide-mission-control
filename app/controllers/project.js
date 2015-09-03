'use strict';
var dcm = require('../lib/ide-development-container-manager-cli');
var bo  = require('../lib/mission-control-bo');
var CJR = require('carbono-json-response');
var uuid = require('node-uuid');

module.exports = function (app, etcdManager) {

    /**
     * Retrieves the machine of the project
     * @todo Needs implementation
     * @param {object} req - Request object
     * @param {String} req.params.projectId - The id of the required project
     * @param {object} res - Response object (will carry a success or error 
     * carbono-json-message)
     */
    this.retrieve = function (req, res) {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            if (!req.params.projectId) {
                res.status(400);
                var err = {
                       code: 400,
                       message: 'projectId cannot be null',
                   };
                cjr.setError(err);
            } else {
                cjr.setData(
                   {
                       id: uuid.v4(),
                       items: [
                            {
                                projectId: req.params.projectId,
                            }
                           ],
                   }
                );
            }
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    /**
     * Lists all projects associated with one user.
     * @todo Implement User Context
     * @param {object} req - Request object
     * @param {object} res - Response object (will carry a success or error 
     * carbono-json-message)
     */
    this.list = function (req, res) {
        var list = dcm.list();
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            if (!req.body || list === undefined) {
                res.status(400);
                var err = {
                       code: 400,
                       message: 'Could not list projects',
                   };
                cjr.setError(err);
            } else {
                cjr.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            }
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    /**
     * Handles request for the creation of a project. This will communicate
     * with DCM to create a new project and get the reference of the Code Machine
     * @todo Put cm in a user context
     * @todo Discover correct projectId
     * @param {object} req - Request object
     * @param {object} res - Response object (will carry a success or error 
     * carbono-json-message)
     */
    this.create = function (req, res) {
        // Discover correct projectId
        var projectId = 'u18923uhe12u90uy781gdu';
        // Discovers with etcdManager the DCM URL
        var dcmURL = etcdManager.getDcmUrl();
        
        bo.createDevContainer(dcmURL, projectId, 
            /**
             * Callback function for the creation of a project on DCM
             * @param {object} err - Error object containing any errors
             * @param {object} ret - Return values from the method
             * @param {String} ret.markedURL - Path for Marked files
             * @param {String} ret.srcURL - Path for Clean files
             * @param {Object} cm - Code Machine reference
             */
            function (err, ret, cm) {
                var cjr = new CJR({apiVersion: '1.0'});
                try {
                    if (err) {
                        res.status(400);
                        var error = {
                               code: 400,
                               message: 'Could not create project',
                               errors: err,
                           };
                        cjr.setError(error);
                    } else {
                        app.cm = cm;
                        cjr.setData(
                           {
                               id: uuid.v4(),
                               items: ret,
                           }
                        );
                    }
                    res.json(cjr);
                    res.end();
                } catch (e) {
                    res.status(500).end();
                }
            }
        );
    };
    

    return this;
};
