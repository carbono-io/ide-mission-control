// - assets.carbono.io/ide: servir assets da IDE (html, css, js, imagens, etc.) 
// - /new-project: criar um novo contêiner de desenvolvimento já com o código fonte do frontend gerado pronto
// - /project-source-files/$project-id, o mission control deverá servir os arquivos estáticos que compõem o projeto frontend.
/* global done, it, describe, afterEach */
var should = require('../node_modules/should');
var request = require('../node_modules/supertest');
var io = require('../node_modules/socket.io-client');

var conn;
var _connSettings = {
    'reconnection delay' : 0,
    'reopen delay' : 0,
    'force new connection' : true
};

var _URL = 'http://localhost:3000';
var _WSURL = 'http://localhost:3001/project';

// Close every connection
afterEach( function(done) {
    if(conn && conn.connected) {
        conn.on('connection', function() {
            conn.on('disconnect', function() {
                done();
            });
        });
        conn.disconnect();
    }else{
        done();
    }
});

// Json object test
function assertJson(data){
    should.exist(data);
    data.should.be.an.instanceOf(Object);
	data.should.not.be.equal(null);
}

describe('JRD-88: Implementar MissionControl', function() {
	
    it('Servir assets da IDE (html, css, js, imagens, etc.)', function(done) {
        request(_URL)
            .get('/gui')
            .expect(200, 
                'Graphical user interface.',
                done
            );
    });
	
    it('O mission control deverá servir os arquivos estáticos que compõem o projeto frontend.', function(done) {
        request(_URL)
            .get('/src/marked')
            .expect(200, 
                'Marked source code.',
                done
            );
    });
	
    it('Criar um novo contêiner de desenvolvimento já com o código fonte do frontend gerado pronto', function(done) {
		conn = io.connect(_WSURL, _connSettings);
        conn.emit('create', {name: 'test'});
        conn.on('created', function (proj) {
            proj.should.have.property('url', 'bla');
			assertJson(proj);
		});
    });
	
});