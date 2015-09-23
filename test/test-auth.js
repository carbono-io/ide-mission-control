'use strict';

var authServer = require('../app/auth/lib/auth-server-wrapper');

var chai = require('chai');
var should = chai.should();

describe('Wrapper for carbono-auth', function () {

    it('finds an user with a valid token', function (done) {
        var promise = authServer.findUser('token_valido');

        promise.then(
            function (user) {
                should.exist(user);
                user.should.be.an('object');

                user.should.have.property('name');
                should.equal(user.name, 'fulano');

                user.should.have.property('code');
                should.equal(user.code, '1234');

                user.should.have.property('email');
                should.equal(user.email, 'email@email.com');
            },
            function (err) {
                should.fail(null, null, err);
            }
        )
        .done(function () {
            done();
        });
    });

    it('can\'t find an user with an invalid token', function (done) {
        var promise = authServer.findUser('token_invalido');

        promise.then(
            function () {
                should.fail(null, null, 'this test should not return an user');
            },
            function (err) {
                should.not.exist(err);
            }
        )
        .done(function () {
            done();
        });
    });

    it('must identify request errors', function (done) {
        var promise = authServer.findUser('status code desconhecido');

        promise.then(
            function () {
                should.fail(null, null, 'this test should not return an user');
            }, function (err) {
                should.exist(err);
                err.should.be.a('string');
            }
        )
        .done(function () {
            done();
        });
    });

    it('must not create a promise when there\'s no token', function () {
        var promise = authServer.findUser(null);
        should.not.exist(promise);
    });
});
