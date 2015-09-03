'use strict';
var request = require('request');

/**
 * This class represents the Code Machine in the interactions
 * 
 * @class CM
 * @param {object} req - Request object
 * @param {String} req.url - Path for the file
 * @param {object} res - Response containing the requested file
 */
var CM = function (container) {
    this.container = container;

    if (!this.container.markedURL) {
        throw 'Container must contain marked url.';
    }

    if (!this.container.cleanURL) {
        throw 'Container must contain clean url.';
    }
    
    return this;
};



/**
 * Creates reference for CM
 * 
 * @todo Implement...
 * @return {object} obj.uuid Containing the Id of the CM
 */
CM.prototype.create = function () {
    return {
        uuid: 'bla',
    };
};

/**
 * Lists reference
 * 
 * @todo Implement...
 * @return {list} views Containing a list of references
 */
CM.prototype.list = function () {
    return {
        views: [
            {uuid: 1},
            {uuid: 2},
        ],
    };
};

/**
 * Deletes reference
 * 
 * @todo Implement...
 * @return {object} obj
 */
CM.prototype.del = function () {
    return {
        good: 'bye',
    };
};

/**
 * Appends a Node
 * 
 * @todo Implement...
 * @return {object} obj
 */
CM.prototype.apNode = function () {
    return {
        uuid: '8hRSD7uyDm8302',
    };
};

/**
 * Removes a Node
 * 
 * @todo Implement...
 * @return {object} obj
 */
CM.prototype.rmNode = function () {
    return {
        good: 'bye',
    };
};

/**
 * Edits a Node
 * 
 * @todo Implement...
 * @return {object} obj
 */
CM.prototype.edNodeAtt = function () {
    return {
        it: 'is done',
    };
};

/**
 * Handles request for a Marked file
 * 
 * @param {object} req - Request object
 * @param {String} req.url - Path for the file
 * @param {object} res - Response containing the requested file
 */
CM.prototype.marked =  function (req, res) {
    var cmURL = this.container.markedURL + req.url;
    req.pipe(request(cmURL)).pipe(res);
};

/**
 * Handles request for a Clean file
 * 
 * @param {object} req - Request object
 * @param {String} req.url - Path for the file
 * @param {object} res - Response containing the requested file
 */
CM.prototype.clean =  function (req, res) {
    var cmURL = this.container.cleanURL + req.url;
    req.pipe(request(cmURL)).pipe(res);
};

module.exports = CM;