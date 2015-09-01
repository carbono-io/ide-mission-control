'use strict';
var request = require('supertest');
var should = require('should');

var url ='http://localhost:7890';

var server = request.agent(url);

function defaultResponse(res) {
    res.should.have.property('apiVersion');
    res.should.have.property('id');
    res.should.have.property('data');
    res.data.should.have.property('items');
}
    
describe('Basic routes - This test should work when:', function () {

    it('root url is accessible', function (done) {
        server
            .get('/')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    jsonResponse.data.items[0].should.have.property('message', 
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
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    jsonResponse.data.items[0].should.have.property('projectId');
                } catch (e) {
                    return done(e);
                }
                done();
            });
    });
    
    it('projects can be listed', function (done) {
        server
            .get('/project')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    // To do
                    // List projects
                } catch (e) {
                    return done(e);
                }
                done();
            });
    });
});

describe('Routes that require a created project - This test should work when:', function () {
    var projectId = "";
    var resourcesPath = '/project/' + projectId + '/resources';
    before(function(done) {
        server
            .post('/project')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    jsonResponse.data.items[0].should.have.property('projectId');
                    projectId = jsonResponse.data.items[0].projectId;
                } catch (e) {
                    return done(e);
                }
                done();
            });
    });

    it('project can be retrieved', function (done) {
        server
            .get('/project/' + projectId)
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    jsonResponse.data.items[0].should.have.property('projectId');
                    jsonResponse.data.items[0].projectId.should.equal(projectId);
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
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    jsonResponse.data.items[0].should.have.property('message', 
                    'Command line interface.');

                } catch (e) {
                    return done(e);
                }
                done();
            });
    });
    
    it('gui is accessible', function (done) {
        server
            .get(resourcesPath + '/gui')
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){
                if (err) return done(err);
                res.status.should.equal(200);
                try {
                    var jsonResponse = JSON.parse(res.body);
                    defaultResponse(jsonResponse);
                    jsonResponse.data.items[0].should.have.property('message', 
                    'Graphical user interface.');

                } catch (e) {
                    return done(e);
                }
                done();
            });
    });
    
});
    


