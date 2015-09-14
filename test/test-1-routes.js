'use strict';
var request = require('supertest');
var should = require('should');

var url = 'http://localhost:7890';

var server = request.agent(url);

function defaultResponse(res) {
    res.should.have.property('apiVersion');
    res.should.have.property('id');
    res.should.have.property('data');
    res.data.should.have.property('items');
    res.data.items.should.be.instanceof(Array);
}

var serverObj;

describe('Routing tests --> ', function () {
    before(function () {
        // Starting Server
        serverObj = require('../');
    });

    after(function () {
        // Closing Server
        serverObj.close();
    });

    describe('Basic routes - This test should work when:', function () {

        it('root url is accessible', function (done) {
            server
                .get('/')
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    // To shut up JSHint
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

        it('project can be created', function (done) {
            server
                .post('/project')
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        // ID is projectId
                        jsonResponse.data.should.have.property('id');
                        // Marked and Clean URL
                        jsonResponse.data.items[0].should.have.
                        property('markedURL');
                        jsonResponse.data.items[0].should.have.
                        property('srcURL');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('projects can be listed', function (done) {
            server
                .get('/project')
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].should.have.
                        property('containers');
                        // To do
                        // List projects
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
        var resourcesPath = '/project/' + projectId + '/resources';
        beforeEach(function (done) {
            server
                .post('/project')
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        // ID is projectId
                        jsonResponse.data.should.have.property('id');
                        projectId = jsonResponse.data.id;
                        resourcesPath = '/project/' + projectId + '/resources';
                        // Marked and Clean URL
                        jsonResponse.data.items[0].should.have.
                        property('markedURL');
                        jsonResponse.data.items[0].should.have.
                        property('srcURL');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('project can be retrieved', function (done) {
            server
                .get('/project/' + projectId)
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = JSON.parse(res.body);
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].should.have.
                        property('projectId');
                        jsonResponse.data.items[0].projectId.should.
                        equal(projectId);
                        // To do .. retrive project
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cli is accessible', function (done) {
            server
                .get(resourcesPath + '/cli')
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
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
                .expect('Content-type',/json/)
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
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
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a clean HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/clean/src/index.html')
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a marked non-HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/marked/src/index.css')
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a clean non-HTML file can be retrieved', function (done) {
            server
                .get(resourcesPath + '/clean/src/index.css')
                .expect(200)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.be.html;
                    res.status.should.equal(200);
                    done();
                });
        });

        it('a invalid marked HTML file cannot be retrieved', function (done) {
            server
                .get(resourcesPath + '/marked/src/index2.html')
                .expect(404)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.be.html;
                    res.status.should.equal(404);
                    done();
                });
        });

        it('a invalid clean HTML file cannot be retrieved', function (done) {
            server
                .get(resourcesPath + '/clean/src/index2.html')
                .expect(404)
                .end(function (err,res) {
                    if (err) {
                        return done(err);
                    }
                    res.should.be.html;
                    res.status.should.equal(404);
                    done();
                });
        });

        it('a invalid clean non-HTML file cannot be retrieved',
            function (done) {
                server
                    .get(resourcesPath + '/clean/src/index2.css')
                    .expect(404)
                    .end(function (err,res) {
                        if (err) {
                            return done(err);
                        }
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
                    .expect(404)
                    .end(function (err,res) {
                        if (err) {
                            return done(err);
                        }
                        res.should.be.html;
                        res.status.should.equal(404);
                        done();
                    });
            }
        );
        
    });

    describe('IPE calls ar working well when:', function() {
        it('I can request an specific container',
            function(done){
                var load = {
                    projectId: 'myProject001',
                    machineAlias: 'simonfan/code-machine'
                };
                server
                    .post('/createContainer', load)
                    .expect(200);
                done();
            }
        );
        
        it('Previous request should fail when I forget important data',
            function(done){
                var load = {
                    projectId: 'myProject001',
                }
                server
                    .post('/createContainer', load)
                    .expect(400)
                done();
            }
        );
    })
});