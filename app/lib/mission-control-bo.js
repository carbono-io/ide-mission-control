'use strict';
var CM = require('./code-machine-cli');
var dcm = require('./ide-development-container-manager-cli');

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
    dcm.create(dcmURL, project, function (err, res) {
        var cm;
        if (!err) {
            // Todo Synchronize wit DCM
            var path = res.data.items[0].url;
            /* Comment
            var path = url.format({
                protocol: 'http',
                hostname: res.host,
                port: res.ports['8000'],
            });
            */

            var container = {
                id: res.containerId,
                markedURL: path + '/resources/marked',
                cleanURL: path + '/resources/clean',
                wsURL: path,
            };
            // Instantiate CM object
            cm = new CM(container);
            res = {
                markedURL: path + '/resources/marked',
                srcURL: path + '/resources',
            };
        }
        cb(err, res, cm);
    });
};
