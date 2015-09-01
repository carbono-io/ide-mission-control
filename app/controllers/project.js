'use strict';
var dcm = require('../lib/ide-development-container-manager-cli');
var bo  = require('../lib/mission-control-bo');
var CJR = require('carbono-json-response');
var uuid = require('node-uuid');

module.exports = function (app, etcdManager) {

    this.retrieve = function (req, res) {
        // To do ...
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            if (!req.params.projectId) {
                res.status(400);
                var err = {
                       code: 400,
                       message: 'projectId cannot be null',
                   };
                cjr.setError(err);
            } else {
                cjr.setData(
                   {
                       id: uuid.v4(),
                       items: [
                            {
                                projectId: req.params.projectId,
                            }
                           ],
                   }
                );
            }
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };

    this.list = function (req, res) {
        var list = dcm.list();
        var cjr = new CJR({apiVersion: '1.0'});
        try {
            if (!req.body || list == undefined) {
                res.status(400);
                var err = {
                       code: 400,
                       message: 'Could not list projects',
                   };
                cjr.setError(err);
            } else {
                cjr.setData(
                   {
                       id: uuid.v4(),
                       items: list,
                   }
                );
            }
            res.json(cjr);
            res.end();
        } catch (e) {
            res.status(500).end();
        }
    };
    /**
     * @todo Put cm in a user context
     */
    this.create = function (req, res) {
        // Calls Account Manager for projectID
        var projectId = 'u18923uhe12u90uy781gdu';
        var dcmURL = etcdManager.getDcmUrl();

        bo.createDevContainer(dcmURL, projectId, function (err, ret, cm) {
            var cjr = new CJR({apiVersion: '1.0'});
            try {
                if (err) {
                    console.log(err);
                    res.status(400);
                    var err = {
                           code: 400,
                           message: 'Could not create project',
                           errors: err,
                       };
                    cjr.setError(err);
                } else {
                    app.cm = cm;
                    cjr.setData(
                       {
                           id: uuid.v4(),
                           items: ret,
                       }
                    );
                }
                res.json(cjr);
                res.end();
            } catch (e) {
                res.status(500).end();
            }
        });
    };

    return this;
};
