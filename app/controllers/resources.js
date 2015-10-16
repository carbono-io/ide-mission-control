'use strict';

var CJM  = require('carbono-json-messages');
var uuid = require('node-uuid');

/**
 * @todo Get cm from user context
 */
module.exports = function (app) {
    /**
     * Root function for Mission Control. Will be called on '/'
     * @param {Object} - req Request object
     * @param {Object} - res Response object (will carry a success or error
     * carbono-json-message)
     */
    this.root = function (req, res) {
        var cjm = new CJM({apiVersion: '1.0'});
        try {
            res.status(200);
            var list = [ { message: 'Nothing to see here ¯\\_(ツ)_/¯' +
                ' Try http://carbono.io/' } ];
            cjm.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            res.json(cjm);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    /**
     * This functions builds the errors that should be sent with the response
     *
     * @function
     * @param {Object} app - app object
     * @param {Object} app.cm - CodeMachine reference
     * @param {Object} req - Request Object
     * @param {string} req.params.fileName - Name/path of the file
     */
    var buildErrors = function (app, req) {
        var errors = [];
        var error;
        var code = 400;
        if (!app.cm[req.params.projectId]) {
            error = {
                domain: 'Code Machine',
                reason: 'Code Machine not instantiated',
                message: 'The code machine was not created or was' +
                ' not retrieved to execute this operation',
            };
            errors.push(error);
        }
        if (!req.params.fileName) {
            code = 404;
            error = {
                domain: 'fileName',
                reason: 'fileName cannot be null',
                message: 'You must specify a valid fileName',
            };
            errors.push(error);
        }

        var err = {
               code: code,
               message: 'An error occured in your request',
               errors: errors,
           };
        return err;
    };

    /**
     * Handles a request for a Clean file (of any type) and asks Code Machine
     * for the specified file
     * @param {Object} req - Request object
     * @param {string} req.params.projectId - The id of the current project
     * @param {string} req.params.fileName - The name (with path) of the
     * required clean file
     * @param {Object} res - Response object (will carry a file or error
     * carbono-json-message)
     */
    this.clean = function (req, res) {
        var cjm = new CJM({apiVersion: '1.0'});
        try {
            var _cm = app.cm[req.params.projectId];
            if (!_cm || !req.path) {
                res.status(400);
                cjm.setError(buildErrors(app, req));
                res.json(cjm);
                res.end();
            } else {
                var fileNameArr = req.path;
                var clean = '/clean';
                req.url = fileNameArr.substr(fileNameArr.indexOf(clean) +
                clean.length);
                // Calls Code Machine for the file
                _cm.clean(req, res);
            }
        } catch (e) {
            res.status(500).end();
        }
    };

    /**
     * Handles a request for a Marked file (of any type) and asks Code Machine
     * for the specified file
     * @param {Object} req - Request object
     * @param {string} req.params.projectId - The id of the current project
     * @param {string} req.params.fileName - The name (with path) of the
     * clean file
     * @param {Object} res - Response object (will carry a file or error
     * carbono-json-message)
     */
    this.marked = function (req, res) {
        var cjm = new CJM({apiVersion: '1.0'});
        try {
            var _cm = app.cm[req.params.projectId];
            if (!_cm || !req.path) {
                res.status(400);
                cjm.setError(buildErrors(app, req));
                res.json(cjm);
                res.end();
            } else {
                var fileNameArr = req.path;
                var marked = '/marked';
                req.url = fileNameArr.substr(fileNameArr.indexOf(marked) +
                marked.length);
                // Calls Code Machine for the file
                _cm.marked(req, res);
            }
        } catch (e) {
            res.status(500).end();
        }
    };
    /**
     * Future Granphical User Interface (GUI)
     * @param {Object} req - Request object
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.gui = function (req, res) {
        var cjm = new CJM({apiVersion: '1.0'});
        try {
            res.status(200);
            var list = [
                    {
                        message: 'Graphical user interface.',
                    },
                ];
            cjm.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            res.json(cjm);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    /**
     * Future Comand Line Interface (CLI)
     * @param {Object} req - Request object
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.cli = function (req, res) {
        var cjm = new CJM({apiVersion: '1.0'});
        try {
            res.status(200);
            var list = [
                    {
                        message: 'Command line interface.',
                    },
                ];
            cjm.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            res.json(cjm);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    return this;
};
