/* global done, it, describe */
var express = require('../node_modules/express');
var should = require('../node_modules/should');
var request = require('../node_modules/supertest'); 

var app = express();
var url = 'http://localhost:3000';

describe('Routes - This test should work when:', function() {

    it('root url is accessible', function(done) {
        request(url)
            .get('/')
            .expect(200, 
                'You are doing it wrong! Try http://carbono.io/',
                done
            );
    });
    
    it('source code is available', function(done) {
        request(url)
            .get('/src')
            .expect(200, 
                'Source code.',
                done
            );
    });
    
    it('Marked source from code-machine is on.', function(done) {
        request(url)
            .get('/src/marked')
            .expect(200, 
                'Marked source code.',
                done
            );
    });
    
    it('Gui should be on.', function(done) {
        request(url)
            .get('/gui')
            .expect(200, 
                'Graphical user interface.',
                done
            );
    });
    
    it('Cli should be awsome.', function(done) {
        request(url)
            .get('/cli')
            .expect(200, 
                'Command line interface.',
                done
            );
    });
    
});