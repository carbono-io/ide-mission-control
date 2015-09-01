'use strict';
var CJR = require('carbono-json-response');
var uuid = require('node-uuid');

/**
 * @todo Get cm from user context
 */
module.exports = function (app, etcdManager) {

    this.root = function (req, res) {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            res.status(200);
            var list = [
                    {
                        message: 'You are doing it wrong! Try http://carbono.io/',
                    }
                ]
            cjr.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    this.clean = function (req, res) {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            if (!app.cm || !req.path) {
                res.status(400);
                var errors = [];
                var error;
                var code = 400;
                if (!app.cm) {
                    error = {
                        domain: 'Code Machine',
                        reason: 'Code Machine not instantiated',
                        message: 'The code machine was not created or was not retrieved to execute this operation'
                    }
                    errors.push(error);
                }
                if (!req.params.fileName) {
                    code = 404;
                    error = {
                        domain: 'fileName',
                        reason: 'fileName cannot be null',
                        message: 'You must specify a valid fileName'
                    }
                    errors.push(error);
                }
                
                var err = {
                       code: code,
                       message: 'An error occured in your request',
                       errors: errors
                   };
                cjr.setError(err);
                res.json(cjr);
                res.end();
            } else {
                var fileNameArr = req.path;
                var clean = '/clean';
                req.url = fileNameArr.substr(fileNameArr.indexOf(clean) + clean.length);
                app.cm.clean(req, res);
            }
            
        } catch (e) {
            res.status(500).end();
        }
        
    };

    this.marked = function (req, res) {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            if (!app.cm || !req.path) {
                res.status(400);
                var errors = [];
                var error;
                var code = 400;
                if (!app.cm) {
                    error = {
                        domain: 'Code Machine',
                        reason: 'Code Machine not instantiated',
                        message: 'The code machine was not created or was not retrieved to execute this operation'
                    }
                    errors.push(error);
                }
                if (!req.params.fileName) {
                    code = 404;
                    error = {
                        domain: 'fileName',
                        reason: 'fileName cannot be null',
                        message: 'You must specify a valid fileName'
                    }
                    errors.push(error);
                }
                
                var err = {
                       code: code,
                       message: 'An error occured in your request',
                       errors: errors
                   };
                cjr.setError(err);
                res.json(cjr);
                res.end();
            } else {
                var fileNameArr = req.path;
                var marked = '/marked';
                req.url = fileNameArr.substr(fileNameArr.indexOf(marked) + marked.length);
                app.cm.marked(req, res);
            }
            
        } catch (e) {
            res.status(500).end();
        }
    };

    this.gui = function (req, res) {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            res.status(200);
            var list = [
                    {
                        message: 'Graphical user interface.',
                    }
                ]
            cjr.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    this.cli = function (req, res) {
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            res.status(200);
            var list = [
                    {
                        message: 'Command line interface.',
                    }
                ]
            cjr.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    return this;
};
