'use strict';
var CM = require('./code-machine-cli');
var dcm = require('./ide-development-container-manager-cli');

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
            var url = res.data.items[0].url;
            var container = {
                id: res.containerId,
                markedURL: url + '/resources/marked',
                cleanURL: url + '/resources/clean',
                wsURL: url,
            };
            cm = new CM(container);
            res = {
                markedURL: url + '/resources/marked',
                srcURL: url + '/resources',
            };
        }
        cb(err, res, cm);
    });
};
