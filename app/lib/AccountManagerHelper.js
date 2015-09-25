'use strict';
var q = require('q');
var request = require('request');
var uuid = require('node-uuid');
var pjson = require('../../package.json');

var path = null;

/**
 * Builds a request for the request module
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 * @param {string} data.name - The name of the project
 * @param {string} data.description - The description of the project
 */
function buildRequest(data) {
    return {
        headers: {
            crbemail: data.owner,
        },
        uri: path + '/projects',
        method: 'POST',
        json: {
            apiVersion: pjson.version,
            id: uuid.v4(),
            data:
                {
                    id: uuid.v4(),
                    items: [{
                        name: data.name,
                        description: data.description,
                    },
                ],
                },
        },
    };
}
/**
 * Class that comminicates with Account Manager
 *
  @class
 * @param {string} accmPath - The account manager url
 */
var AccountManager = function (accmPath) {
    path = accmPath;
    return this;
};

/**
 * Communicates with Account Manager and creates a new project
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 * @param {string} data.name - The name of the project
 * @param {string} data.description - The description of the project
 */
AccountManager.prototype.createProject = function (data) {
    var deferred = q.defer();
    try {
        request(buildRequest(
            {
                owner: data.owner,
                name: data.name,
                description: data.description,
            }),
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = res.body;
                            var data = jsonRes.data.items[0];
                            deferred.resolve({
                                code: data.project.code,
                                safeName: data.project.safeName,
                                name: data.project.name,
                                description: data.project.description,
                            });
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            jsonRes = res.body;
                            deferred.reject({
                                code: jsonRes.error.code,
                                message: jsonRes.error.message,
                            });
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    }
                } else {
                    deferred.reject({
                        code: 500,
                        message: 'Could not create project',
                    });
                }
            }
        );
    } catch (e) {
        deferred.reject({
                code: 400,
                message: e,
            });
    }
    return deferred.promise;
};
module.exports = AccountManager;
