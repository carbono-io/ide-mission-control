'use strict';
var consign    = require('consign');
var express    = require('express');
var config     = require('config');
var ws         = require('socket.io');
var bodyParser = require('body-parser');
var app        = express();

var htPort = config.get('htPort');
var wsPort = config.get('wsPort');

var EtcdManager = require('./app/lib/etcd-manager.js');
var etcdManager = new EtcdManager();

// Parse JSON data in post requests
app.use(bodyParser.json());

app.ws = ws(wsPort);

consign({cwd: 'app'})
    .include('auth')
    .include('controllers')
    .include('routes')
    .into(app, etcdManager);

var server = app.listen(htPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
    etcdManager.init();
});

module.exports = server;
