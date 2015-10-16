'use strict';

var bo             = require('../lib/mission-control-bo');
var uuid           = require('node-uuid');
var AccountManager = require('../lib/AccountManagerHelper');
var etcd           = require('carbono-service-manager');

module.exports = function (app) {
    var RequestHelper = require('../lib/RequestHelper');
    var _h = new RequestHelper();

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

        /**
         * Function called to create Container
         */
        function _createContainer(project) {
            // Calls DCM to create the machine
            // Discovers with etcdManager the DCM URL
            var dcmURL = etcd.getServiceUrl('dcm');

            // Create Websocket for Code Machine
            function _createWebsocket(path, cm){
                app.ws.of('/mc/cm/' + project.code).on('connection',
                    function (socket) {
                        cm.commands.forEach(function (cmd) {
                            socket.on(cmd, cm.emit.bind(cm, cmd));
                        });

                        cm.events.forEach(function (ev) {
                            var listener = socket.emit.bind(socket, ev);

                            cm.on(ev, listener);
                            socket.on('disconnect', function () {
                                 cm.removeListener(ev, listener);
                            });
                        });
                    });
            };
            // Request business logic to create Container
            bo.createDevContainer(dcmURL, project.code,
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
                function (err, container, cm) {
                    try {
                        if (err) {
                            _h.createResponse(res, 400,
                                ['Could not create project',err,].join(' - '));
                        } else {
                            // Store cm and create websocket
                            app.cm[project.code] = cm;
                            _createWebsocket(project.code, cm);
                            // Set cm routes to the project
                            project.markedURL = container.markedURL;
                            project.srcURL = container.srcURL;
                            // Send response
                            var payload = {
                                id: uuid.v4(),
                                items: [{ project: project }],
                            };
                            _h.createResponse(res, 201, payload);
                        }
                    } catch (e) {
                        console.log('ponto 1', e);
                        _h.createResponse( res, 500, e );
                    }
            });
        }


        /**
         * Error Handling block
         */
        if (req.user !== null && req.user && req.user.emails[0].value) {
            // Check message consistency
            console.log('user', req.user);
            if ( _h.checkMessageStructure(req) ) {
                var userData = req.body.data.items[0];
                userData.owner = req.user.emails[0].value;
                var missingProperties =
                    _h.checkRequiredData(
                        userData, ['owner', 'name', 'description']);

                if (missingProperties.length) {
                    var errMessage = '';
                    missingProperties.forEach(function (prop) {
                        errMessage += 'Malformed request: ' + prop +
                        ' is required.\n';
                    });
                    _h.createResponse(res, 400, errMessage);

                } else {
                    try {
                        console.log('user data', userData);
                        // Discovers with etcdManager the ACCM URL
                        var accmURL = etcd.getServiceUrl('accm');
                        var accm = new AccountManager(accmURL);
                        // Discover correct projectId
                        accm.createProject(userData).then(
                            // If Project was created then
                            _createContainer,
                            // in case it failed
                            function failedToCreateProj(e) {
                                console.log('failed 3', e);
                                _h.createResponse(res, e.code, e.message);
                            }
                        );

                    } catch (e) {
                        console.log('ponto 2', e);
                        _h.createResponse(res, 500, e);
                    }
                }
            } else {
                _h.createResponse(res, 400, 'Malformed request');
            }
        } else {
            _h.createResponse(res, 403, 'Unauthorized');
        }
    };

    return this;
};