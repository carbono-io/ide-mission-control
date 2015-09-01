'use strict';
var colors  = require('colors');
var consign = require('consign');
var express = require('express');
var config  = require('config');
var ws      = require('socket.io');
var app     = express();

var htPort = config.get('htPort');
var wsPort = config.get('wsPort');

var EtcdManager = require('./app/lib/etcd-manager.js');
var etcdManager = new EtcdManager();

app.ws = ws(wsPort);

consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app, etcdManager);

var server = app.listen(htPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
    
    etcdManager.init();
});
