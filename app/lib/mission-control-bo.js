'use strict';
var CM = require('./code-machine-cli');
var dcm = require('./ide-development-container-manager-cli');
var url = require('url');

/**
 * Pedir uma maquina pro dcm e nesse momento criar uma
 * instancia de conexao parametrizada de code-machine
 * @todo treat errors
 *
 * parameters filesUrl, userID, proj
 */
exports.createDevContainer = function (project, cb) {
    dcm.create(project, function (err, res) {
        var cm;
        if (!err) {
            // var url = res.data.items[0].url;
            var path = url.format({
                protocol: 'http',
                hostname: res.host,
                port: res.ports['8000'],
            });

            var container = {
                id: res.containerId,
                markedURL: path + '/resources/marked',
                cleanURL: path + '/resources/clean',
                wsURL: path,
            };
            cm = new CM(container);
            res = {
                markedURL: path + '/resources/marked',
                srcURL: path + '/resources',
            };
        }
        cb(err, res, cm);
    });
};
