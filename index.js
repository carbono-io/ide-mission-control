'use strict';
var consign = require('consign');
var express = require('express');
var config  = require('config');
var ws      = require('socket.io');
var app     = express();

var htPort = config.get('htPort');
var wsPort = config.get('wsPort');

var ServiceManager = require('./app/lib/service-manager');
global.serviceManager = new ServiceManager(process.env.ETCD_ORIGIN);

app.ws = ws(wsPort);

consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);

var server = app.listen(htPort, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
});