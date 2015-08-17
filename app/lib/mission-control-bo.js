'use strict';
var CM = require('./code-machine-cli');
var dcm = require('./ide-development-container-manager-cli');

/**
 * pedir uma maquina pro dcm e nesse momento criar uma 
 * instancia de conexao parametrizada de code-machine.
 * @TODO treat errors
 * @parameters filesUrl, userID, proj
 */
exports.createDevContainer = function(project, cb){
	dcm.create(project, function(err, res){
		var cm;
	    if(!err){
			var url = 'http://' + res.host + ':' + res.ports['8000'];
			var container = {
				id: res.containerId,
				markedURL: url + '/resources/marked',
				cleanURL: url + '/resources/clean',
				wsURL: url
			}
	        cm = new CM(container);
			res = {
				markedURL: 'http://127.0.0.1/marked', 
				srcURL: 'http://127.0.0.1/src'
			}
	    };
		cb(err, res, cm);
	});
};