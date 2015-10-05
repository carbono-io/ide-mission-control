'use strict';
var request = require('supertest');
var sinon    = require('sinon');
var should = require('chai').should();
var authenticate = require('../app/authenticate');
var url = 'http://localhost:7890';

var server = request.agent(url);

function defaultResponse(res) {
    res.should.have.property('apiVersion');
    res.should.have.property('id');
    res.should.have.property('data');
    res.data.should.have.property('items');
    res.data.items.should.be.instanceof(Array);
}

function defaultErrorResponse(res) {
    res.should.have.property('apiVersion');
    res.should.have.property('id');
    res.should.have.property('error');
    res.error.should.have.property('code');
    res.error.should.have.property('message');
}

function correctPostMessage(info) {
    return {
            apiVersion: '1.0',
            id: '12345',
            data: {
                id: '98765',
                items: [
                    info,
                ],
            },
        };
}

var serverObj;
var authStub;
function buildUser(code) {
    return {
        provider: 'carbono-oauth2',
        id: 'ladas45Fake',
        displayName: 'Fake Name',
        name: {
            familyName: 'Fake Name',
            givenName: 'Fake Name',
            middleName: '',
        },
        emails: [{
            value: 'email@' + code + '.com',
            type: 'personal',
        },],
        photos: [],
    };
}

function createAuthStub() {
    authStub = sinon.stub(authenticate, 'auth',
    function (req, res, next) {
        if (req.headers.authorization) {
            var token = req.headers.authorization.split(' ');
            switch (token[1]) {
                case 'token_200': {
                    req.user = buildUser(200);
                    break;
                }
                default: {
                    break;
                }
            }
            next();
        } else {
            req.user = null;
            next();
        }
    });
    return authStub;
}

describe('Routing tests --> ', function () {
    before(function (done) {
        this.timeout(5000);
        createAuthStub();
        serverObj = require('../');
        done();
    });

    after(function (done) {
        // Closing Server
        serverObj.close();
        authStub.restore();
        done();
    });

    describe('Basic routes - This test should work when:', function () {

        it('root url is accessible', function (done) {
            server
                .get('/')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].should.have.property(
                        'message',
                        'You are doing it wrong! Try http://carbono.io/');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Project Routes:', function () {
        it('project can be created', function (done) {
            server
                .post('/projects')
                .set('Authorization', 'Bearer token_200')
                .send(correctPostMessage({
                        name: 'Project 201',
                        description: 'Description',
                    }))
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    try {
                        var jsonResponse = res.body;
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].
                        should.have.property('project');
                        jsonResponse.data.items[0].
                        project.should.have.property('code');
                        jsonResponse.data.items[0].
                        project.should.have.property('safeName');
                        jsonResponse.data.items[0].
                        project.should.have.property('name');
                        jsonResponse.data.items[0].
                        project.should.have.property('description');
                        jsonResponse.data.items[0].
                        project.should.have.property('markedURL');
                        jsonResponse.data.items[0].
                        project.should.have.property('srcURL');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('project cannot be created - Missing description', function (done) {
            server
                .post('/projects')
                .set('Authorization', 'Bearer token_200')
                .send(correctPostMessage({
                        name: 'Project 201',
                    }))
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('project cannot be created - Invalid Authorization',
        function (done) {
            server
                .post('/projects')
                .send(correctPostMessage({
                        name: 'Project 201',
                        description: 'Description',
                    }))
                .set('Authorization', 'Bearer invalid')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });
    describe('Routes that require a created project - ' +
    'This test should work when:', function () {
        before(function (done) {
            server
                .post('/projects')
                .set('Authorization', 'Bearer token_200')
                .send(correctPostMessage({
                        name: 'Project 500',
                        description: 'Description',
                    }))
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
        it('a clean HTML file cannot be retrieved with invalid project',
        function (done) {
            server
                .get('/projects/fakeProjectId/resources/clean/src/index.html')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('a clean HTML file cannot be retrieved with invalid project',
        function (done) {
            server
                .get('/projects/fakeProjectId/resources/marked/src/index.html')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });
    describe('Routes that require a created project - ' +
    'This test should work when:', function () {
        var projectId = '';
        var resourcesPath = '/projects/' + projectId + '/resources';
        before(function (done) {
            server
                .post('/projects')
                .set('Authorization', 'Bearer token_200')
                .send(correctPostMessage({
                        name: 'Project 201',
                        description: 'Description',
                    }))
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    try {
                        var jsonResponse = res.body;
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].
                        should.have.property('project');
                        jsonResponse.data.items[0].
                        project.should.have.property('code');
                        jsonResponse.data.items[0].
                        project.should.have.property('safeName');
                        jsonResponse.data.items[0].
                        project.should.have.property('name');
                        jsonResponse.data.items[0].
                        project.should.have.property('description');
                        jsonResponse.data.items[0].
                        project.should.have.property('markedURL');
                        jsonResponse.data.items[0].
                        project.should.have.property('srcURL');
                        projectId = jsonResponse.data.items[0].project.code;
                        resourcesPath = '/projects/' + projectId + '/resources';
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cli is accessible', function (done) {
            server
                .get(resourcesPath + '/cli')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].should.have.
                        property('message', 'Command line interface.');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('gui is accessible', function (done) {
            server
                .get(resourcesPath + '/gui')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].should.have.
                        property('message', 'Graphical user interface.');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('a marked HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/marked/src/index.html')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a clean HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/clean/src/index.html')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a marked non-HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/marked/src/index.css')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a clean non-HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/clean/src/index.css')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a invalid marked HTML file cannot be retrieved', function (done) {
            server
                .get(resourcesPath + '/marked/src/index2.html')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.should.be.html;
                    res.status.should.equal(404);
                    done();
                });
        });

        it('a invalid clean HTML file cannot be retrieved', function (done) {
            server
                .get(resourcesPath + '/clean/src/index2.html')
                .set('Authorization', 'Bearer token_200')
                .end(function (err,res) {
                    should.not.exist(err);
                    res.should.be.html;
                    res.status.should.equal(404);
                    done();
                });
        });

        it('a invalid clean non-HTML file cannot be retrieved',
            function (done) {
                server
                    .get(resourcesPath + '/clean/src/index2.css')
                    .set('Authorization', 'Bearer token_200')
                    .end(function (err,res) {
                        should.not.exist(err);
                        res.should.be.html;
                        res.status.should.equal(404);
                        done();
                    });
            }
        );

        it('a invalid marked non-HTML file cannot be retrieved',
            function (done) {
                server
                    .get(resourcesPath + '/marked/src/index2.css')
                    .set('Authorization', 'Bearer token_200')
                    .end(function (err,res) {
                        should.not.exist(err);
                        res.should.be.html;
                        res.status.should.equal(404);
                        done();
                    });
            }
        );
    });

    describe('IPE calls ar working well when:', function () {
        it('I can request an specific container',
            function (done) {
                server
                    .post('/createContainer')
                    .set('Authorization', 'Bearer token_200')
                    .send(correctPostMessage({
                            projectId: 'myProject001',
                            machineAlias: 'simonfan/code-machine',
                        }))
                    .end(function (err,res) {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        try {
                            var jsonResponse = JSON.parse(res.body);
                            defaultResponse(jsonResponse);
                        } catch (e) {
                            return done(e);
                        }
                        done();
                    });
            }
        );

        it('Previous request should fail when I forget important data',
            function (done) {
                server
                    .post('/createContainer')
                    .set('Authorization', 'Bearer token_200')
                    .send(correctPostMessage({
                            projectId: 'myProject001',
                        }))
                    .end(function (err,res) {
                        should.not.exist(err);
                        res.status.should.equal(400);
                        try {
                            var jsonResponse = JSON.parse(res.body);
                            defaultErrorResponse(jsonResponse);
                        } catch (e) {
                            return done(e);
                        }
                        done();
                    });
            }
        );
    });
});
