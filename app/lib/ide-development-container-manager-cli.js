'use strict';
var config  = require('config')
var request = require('request');

/**
 * List project Ids created.
 * @MOCK
 */
exports.list = function () {
	return {
	    containers: [
	        {name: 'a', uuid: 1},
	        {name: 'b', uuid: 2}
    	]
	};
};
/**
 * Creates and/or retrieves an docker instance and
 * returns a callback function.
 * @TODO: PArse errors and throw them.
 * @return function (err, res)
 */
exports.create = function (proj, cb) {
    var url = config.get('dcmURL') + '/container';
    var load ={
        url: url,
        formData: proj
    }
    var _cb = function(err, httpResponse, body) {
        try{
            body = JSON.parse(body);
        }catch(err){
            this.err = err;
        }
        cb(err, body);
    }
    request.post(load, _cb);
};