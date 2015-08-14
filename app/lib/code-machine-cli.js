var request = require('request');

//mock
exports.create = function () {
	return {
        uuid: 'bla'
    };
};
exports.list = function () {
	return {
        views: [
            {uuid: 1},
            {uuid: 2}
        ]
	};
};
exports.del = function () {
	return {
        good: 'bye',
    };
};
exports.apNode = function () {
	return {
        uuid: '8hRSD7uyDm8302',
    };
};
exports.rmNode = function () {
	return {
        good: 'bye',
    };
};
exports.edNodeAtt = function () {
	return {
        it: 'is done',
    };
};

exports.marked =  function(req, res) {
    var cmURL = 'http://192.168.99.100:32774/resources/marked'+ req.url;
    req.pipe(request(cmURL)).pipe(res);
};

exports.clean =  function(req, res) {
    var cmURL = 'http://192.168.99.100:32774/resources/clean'+ req.url;
    req.pipe(request(cmURL)).pipe(res);
};