'use strict';

var authServer = require('../app/auth/lib/auth-server-wrapper');

var chai = require('chai');
var should = chai.should();

describe('Wrapper for carbono-auth', function () {

    before(function () {
        this.urlMockAuth = 'localhost:3000/carbono-auth';
    });

    it('finds an user with a valid token', function (done) {
        var promise = authServer.findUser('token_valido', this.urlMockAuth);

        promise
            .then(function (user) {
                user.should.exist;
                user.should.be.an('object');

                user.should.have.property('displayName');
                user.displayName.should.be.equal('fulano');

                user.should.have.property('id');
                user.id.should.be.equal('1234');

                user.should.have.property('emails');
                user.emails.should.have.lenght > 0;
                user.emails[0].should.have.property('value');
                user.emails[0].value.should.be.equal('email@email.com');
            })
            .done(function () {
                done();
            });
    });

    it('can\'t find an user with an invalid token', function (done) {
        var promise = authServer.findUser('token_invalido', this.urlMockAuth);

        promise
            .catch(function (err) {
                should.not.exist(err);
            })
            .done(function () {
                done();
            });
    });

    it('must identify request errors', function (done) {
        var promise = authServer
            .findUser('status code desconhecido', this.urlMockAuth);

        promise
            .catch(function (err) {
                should.exist(err);
                err.should.be.a('string');
            })
            .done(function () {
                done();
            });
    });

    it('must not create a promise when there\'s no token', function () {
        var promise = authServer.findUser(null, this.urlMockAuth);
        should.not.exist(promise);
    });
});
