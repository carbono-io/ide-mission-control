'use strict';
var consign = require('consign');
//var app = require('express')();
//var server = require('http').Server(app);
//var io = require('socket.io')(server);
;

//server.listen(3000);

var express = require('express');
var io  = require('socket.io')(3001);
var app = express();

consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);
        
var project = io
    .of('/project')
        .on('connection', function (s) {
            app.routes.project.events(s);
});

var file = io
    .of('/file')
        .on('connection', function (s) {
            app.routes.file.events(s);
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
});