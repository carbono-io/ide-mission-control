'use strict';
var CM = require('./code-machine-cli');
var dcm = require('./ide-development-container-manager-cli');
var ipe = require('./mogno-ipe-client');

/**
 * Pedir uma maquina pro dcm e nesse momento criar uma
 * instancia de conexao parametrizada de code-machine
 * @todo treat errors
 *
 * @param {string} dcmURL - URL retrieved from etcd.
 *
 * parameters filesUrl, userID, proj
 */
exports.createDevContainer = function (dcmURL, project, cb) {
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
            container = {
                markedURL: path + '/resources/marked',
                srcURL: path + '/resources',
            };
        }
        cb(err, container, cm);
    });
};

/**
 * Sends an message to the IPE module requesting an specific machine to be
 * instantiated
 */
exports.createUserContainer = function (ipeURL, project, machineAlias, cb) {

    // NOTE: The machineAlias is not necessarily the docker image name.
    // This is the place where we sholud map machineAlias to image name
    // (Assuming the b.o. is the one who knows everything)
    var dockerImage = machineAlias;

    ipe.create(ipeURL, project, dockerImage, function (err, res) {
        // Nothing else to do?
        cb(err, res);
    });
};
