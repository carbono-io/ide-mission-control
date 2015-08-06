'use strict';
var express = require('express');
var app     = express();

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