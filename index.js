'use strict';
var express = require('express');
var io      = require('socket.io')(3001);

// WebSockets Handler
// --Contexts--
var project = io
    .of('/project')
        .on('connection', function(s) {
            // List all containers on connection
            s.on('list', function() {
                s.emit('listed', {
                    //TODO: everything else. :~D
                    containers: [
                        {name: 'a', uuid: 1},
                        {name: 'b', uuid: 2}
                    ],
                });
            });
            // Create new container on event
            s.on('create', function(name) {
                //TODO: everything else. :~D
                s.emit('created', {
                    url: 'bla',
                    supimpa: 'will get'
                }); 
            });
            // Fetch selected container on event
            s.on('fetch', function(uuid) {
                //TODO: everything else. :~D
                s.emit('retrieved', {
                    url: 'bla',
                    supimpa: 'will get'
                }); 
            });
        });

var file = io
    .of('/file')
        .on('connection', function (s) {
            // Create new app view
            s.on('create', function() {
                //TODO: everything else. :~D
                s.emit('created', {
                    uuid: 'bla',
                });
            });
            // List all app views
            s.on('list', function() {
                //TODO: everything else. :~D
                s.emit('listed', {
                    views: [
                        {uuid: 1},
                        {uuid: 2}
                    ],
                });
            });
            // Delete an app view
            s.on('delete', function(node) {
                //TODO: everything else. :~D
                s.emit('deleted', {
                    good: 'bye',
                });
            });
            // Append new node on file`s dom tree
            s.on('apNode', function(node) {
                //TODO: everything else. :~D
                s.emit('added', {
                    uuid: '8hRSD7uyDm8302',
                });
            });
            // Remove node on file`s dom tree
            s.on('rmNode', function(node) {
                //TODO: everything else. :~D
                s.emit('removed', {
                    good: 'bye',
                });
            });
            // Edit node attributes on file`s dom tree
            // Receive a key value pair for each att changed
            s.on('edNodeAtt', function(node, attTuple) {
                //TODO: everything else. :~D
                s.emit('changed', {
                    it: 'is done',
                });
            });
        });

// --Access Points--
var app = express();

app.get('/', function(req, res) {
    res.send('You are doing it wrong! Try http://carbono.io/');
});

app.get('/src', function(req, res) {
    res.send('Source code.');
});

app.get('/src/marked', function(req, res) {
    res.send('Marked source code.');
});

app.get('/gui', function(req, res) {
    res.send('Graphical user interface.');
});

app.get('/cli', function(req, res) {
    res.send('Command line interface.');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
});