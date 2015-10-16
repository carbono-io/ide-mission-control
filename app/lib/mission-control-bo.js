'use strict';
var CM = require('./code-machine-cli');
var dcm = require('./ide-development-container-manager-cli');
var ipe = require('./mogno-ipe-client');
var etcd  = require('carbono-service-manager');

/**
 * Sends an message to the IPE module requesting an specific machine to be
 * instantiated
 */
var createUserContainer = function (component, internalRoute, cb) {
    // Get the IPE module URL
    var ipeURL = etcd.getServiceUrl('ipe');
    //
    // NOTE: The machineAlias is not necessarily the docker image name.
    // This is the place where we sholud map machineAlias to image name
    // (Assuming the b.o. is the one who knows everything)

    // Route will be composed as <uname>/<uproject>/<internalRoute>
    // where uname is the unique username,
    // and uproject is the user's unique project name.
    var uname = 'username';
    var uproject = 'project';
    var route = uname + '/' + uproject + '/' + internalRoute;

    ipe.createMachine(
            ipeURL,
            component,
            route,
            function (err, res) {
        // Nothing else to do?
        if (cb) {
            cb(err, res);
        }
    });
};

var registerCMRequestListeners = function (cm) {
    var createMachineEv = 'project:createMachine';

    var createMachine = function (data) {
        var machineData = JSON.parse(data).data.items[0];
        createUserContainer(machineData.component, machineData.route);
    };

    if (createMachineEv in cm.requests) {
        cm.on(createMachineEv, createMachine);
    }
};

/**
 * Pedir uma maquina pro dcm e nesse momento criar uma
 * instancia de conexao parametrizada de code-machine
 * @todo treat errors
 *
 * @param {string} dcmURL - URL retrieved from etcd.
 *
 * parameters filesUrl, userID, proj
 */
var createDevContainer = function (dcmURL, project, cb) {
    dcm.create(dcmURL, project, function (err, container) {
        var cm;
        if (!err) {
            // Todo Synchronize wit DCM
            var path = container.data.items[0].url;
            /* Comment
            var path = url.format({
                protocol: 'http',
                hostname: res.host,
                port: res.ports['8000'],
            });
            */

            var config = {
                id: container.containerId,
                markedURL: path + '/resources/marked',
                cleanURL: path + '/resources/clean',
                wsURL: path,
            };
            // Instantiate CM object
            cm = new CM(config);
            registerCMRequestListeners(cm);
            container = {
                markedURL: path + '/resources/marked',
                srcURL: path + '/resources',
            };
        }
        cb(err, container, cm);
    });
};

module.exports = {
    createDevContainer: createDevContainer,
    createUserContainer: createUserContainer,
};
