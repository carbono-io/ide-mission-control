'use strict';
var request = require('request');

module.exports = function (container) {

    if (!container.markedURL) {
        throw 'Container must contain marked url.';
    }

    if (!container.cleanURL) {
        throw 'Container must contain clean url.';
    }

    this.create = function () {
        return {
            uuid: 'bla',
        };
    };
    this.list = function () {
        return {
            views: [
                {uuid: 1},
                {uuid: 2},
            ],
        };
    };
    this.del = function () {
        return {
            good: 'bye',
        };
    };
    this.apNode = function () {
        return {
            uuid: '8hRSD7uyDm8302',
        };
    };
    this.rmNode = function () {
        return {
            good: 'bye',
        };
    };
    this.edNodeAtt = function () {
        return {
            it: 'is done',
        };
    };

    this.marked =  function (req, res) {
        var cmURL = 'http:' + container.markedURL + req.url;
        req.pipe(request(cmURL)).pipe(res);
    };

    this.clean =  function (req, res) {
        var cmURL = 'http:' + container.cleanURL + req.url;
        req.pipe(request(cmURL)).pipe(res);
    };
};
