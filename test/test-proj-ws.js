/* global afterEach, beforeEach, done, it,
describe */
var io = require('../node_modules/socket.io-client');
var should = require('../node_modules/should');

var conn;
var _connSettings = {
    'reconnection delay' : 0,
    'reopen delay' : 0,
    'force new connection' : true
};

// Intercept each test to connect
beforeEach( function(done) {
	conn = io.connect(
	   'http://localhost:3001/project', 
		_connSettings
	);
	conn.on('connect', function() {
        done();
    });
	conn.on('disconnect', function() {
        //console.log('[!] you got disconnected.');
    });
});
// Close every connection
afterEach( function(done) {
    if(conn.connected) {
        conn.disconnect();
    } else {
        //console.log('[!] no connection to break...');
    }
    done();
});

// Json object test
function assertJson(data){
    should.exist(data);
    data.should.be.an.instanceOf(Object);
	data.should.not.be.equal(null);
}

// Events tester
describe('Project WebSocket - This test should work when:', function() {

    it('a new project is created', function(done) {
        var proj = {
            projectId : '12312312'
        }
        conn.emit('create', proj);
        conn.on('created', function (proj) {
            proj.should.have.property('containerId');
            proj.should.have.property('host');
            proj.should.have.property('ports');
			assertJson(proj);
            done();
		});
    });
    
    it('user need to see proj list', function(done) {
        conn.emit('list');
        conn.on('listed', function (list) {
            list.should.have.property('containers');
			assertJson(list);
            done();
		});
    });
    
    it('a project is selected', function(done) {
        conn.emit('fetch', {uuid: 'hhu4uhhuu4F'});
        conn.on('retrieved', function (proj) {
            proj.should.have.property('url', 'bla');
			assertJson(proj);
            done();
		});
    });
    
});