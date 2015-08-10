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