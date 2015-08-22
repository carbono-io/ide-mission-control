'use strict';
var io = require('../node_modules/socket.io-client');
var should = require('../node_modules/should');

// Json object test
function assertJson(data) {
    should.exist(data);
    data.should.be.an.instanceOf(Object);
    data.should.not.be.equal(null);
}

// Events tester
describe('Project WebSocket - This test should work when:', function () {

    var conn;
    var _connSettings = {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
    };

    // Intercept each test to connect
    beforeEach(function (done) {
        conn = io.connect(
           'http://localhost:3001/project',
            _connSettings
        );
        conn.on('connect', function () {
            done();
        });
    });
    // Close every connection
    afterEach(function (done) {
        if (conn.connected) {
            conn.disconnect();
        }
        done();
    });

    it('a new project is created', function (done) {
        var proj = {
            projectId: '12312312',
        };
        conn.emit('create', proj);
        conn.on('created', function (proj) {
            proj.should.have.property('markedURL');
            proj.should.have.property('srcURL');
            assertJson(proj);
            done();
        });
    });

    it('user need to see proj list', function (done) {
        conn.emit('list');
        conn.on('listed', function (list) {
            list.should.have.property('containers');
            assertJson(list);
            done();
        });
    });

});
