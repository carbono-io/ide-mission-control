//mock
exports.list = function () {
	return {
	    containers: [
	        {name: 'a', uuid: 1},
	        {name: 'b', uuid: 2}
    	]
	};
};
exports.create = function () {
	return {
        url: 'bla',
        supimpa: 'will get'
    };
};
exports.fetch = function () {
	return {
        url: 'bla',
        supimpa: 'will get'
    };
};