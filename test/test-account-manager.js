'use strict';
var AccountManagerHelper = require('../app/lib/AccountManagerHelper.js');
var should = require('chai').should();
var helper = new AccountManagerHelper('http://localhost:3000/account-manager');

describe('AccountManagerHelper', function () {

    describe('createProject()', function () {
        it('Should create projects from a user', function (done) {
            var promiss = helper.createProject({
                owner: 'email@email.com',
                name: 'Project 201',
                description: 'Descricao',
            });
            promiss
                .then(
                    function (res) {
                        should;
                        res.should.have.property('safeName');
                        res.should.have.property('name');
                        res.should.have.property('description');
                        res.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not create projects from a wrong user param',
        function (done) {
            var promiss = helper.createProject({
                owner: 'email@email.com',
                name: 'Project 400',
                description: 'Descricao',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create projects without info', function (done) {
            var promiss = helper.createProject({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });
});
