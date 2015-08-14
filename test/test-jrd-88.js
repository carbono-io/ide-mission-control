// - assets.carbono.io/ide: servir assets da IDE (html, css, js, imagens, etc.) 
// - /new-project: criar um novo contêiner de desenvolvimento já com o código fonte do frontend gerado pronto
// - /project-source-files/$project-id, o mission control deverá servir os arquivos estáticos que compõem o projeto frontend.
/* global done, it, describe, afterEach */
var should = require('../node_modules/should');
var request = require('../node_modules/supertest');
var io = require('../node_modules/socket.io-client');

var _URL = 'http://localhost:3000';
var _WSURL = 'http://127.0.0.1:3001/project';

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
	
    // it('Criar um novo contêiner de desenvolvimento já com o código fonte do frontend gerado pronto', function(done) {
    //     var conn = io.connect(_WSURL);
    //     var data = {
    //         projectId : '12312312'
    //     }
    //     conn.emit('create', data);
    //     conn.on('created', function (proj) {
    //         proj.should.have.property('containerId');
    //         proj.should.have.property('host');
    //         proj.should.have.property('ports');
	// 		assertJson(proj);
    //         done();
	// 	});
    //     conn.disconnect();
    // });
	
});

function assertJson(data){
    should.exist(data);
    data.should.be.an.instanceOf(Object);
	data.should.not.be.equal(null);
}