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
	'http://localhost:3001/file', 
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
describe('File Websocket - This test should work when:', function() {

    it('new app pages are created', function(done) {
        conn.emit('create', {name: 'test'});
        conn.on('created', function (view) {
            view.should.have.property('uuid');
			assertJson(view);
            done();
		});
    });
    
    it('a list of views must be retrieved', function(done) {
        conn.emit('list');
        conn.on('listed', function (list) {
            list.should.have.property('views');
			assertJson(list);
            done();
		});
    });
    
    it('a view must be deleted', function(done) {
        conn.emit('delete', {name: 'test'});
        conn.on('deleted', function (view) {
            view.should.have.property('good', 'bye');
			assertJson(view);
            done();
		});
    });
    
    it('a view dom tree node must be appended', function(done) {
        conn.emit('apNode', {name: 'test'});
        conn.on('added', function (node) {
            node.should.have.property('uuid');
			assertJson(node);
            done();
		});
    });
    
    it('a view dom tree node must be removed', function(done) {
        conn.emit('rmNode', {name: 'test'});
        conn.on('removed', function (node) {
            node.should.have.property('good');
			assertJson(node);
            done();
		});
    });
    
    it('a view dom tree node attributes are changed', function(done) {
        conn.emit('edNodeAtt', {uuid: 1}, {att: [{a:1},{b:2}]});
        conn.on('changed', function (node) {
            node.should.have.property('it', 'is done');
			assertJson(node);
            done();
		});
    });
});