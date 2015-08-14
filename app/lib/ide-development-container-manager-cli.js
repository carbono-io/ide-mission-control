var needle = require('needle');

//mock
exports.list = function () {
	return {
	    containers: [
	        {name: 'a', uuid: 1},
	        {name: 'b', uuid: 2}
    	]
	};
};
/**
 * Creates an docker instance and
 * returns a callback function.
 * @TODO: PArse errors and throw them.
 */
exports.create = function (proj, cb2) {
    var url = 'http://127.0.0.1:8000/container';
    
    var cb = function(err, res) {
         cb2(err, res.body);
    }
    
    needle.post(url, proj, cb);
};
exports.fetch = function () {
	return {
        url: 'bla',
        supimpa: 'will get'
    };
};