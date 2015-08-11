'use strict';
var consign = require('consign');
var express = require('express');
var ws      = require('socket.io')(3001);
var app     = express();

app.ws = ws;

consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
});