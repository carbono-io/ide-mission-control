'use strict';
var colors  = require('colors');
var consign = require('consign');
var express = require('express');
var config  = require('config');
var ws      = require('socket.io');
var app     = express();

var htPort = config.get('htPort');
var wsPort = config.get('wsPort');

var ServiceManager = require('carbono-service-manager');

if (typeof process.env.ETCD_SERVER === 'undefined') {
    console.log('The environment variable ETCD_SERVER is not defined!'.bold.red);
    console.log('Please, define it before continuing, otherwise the'.red);
    console.log('integration will not work!'.red);
    console.log();
} else {
    global.serviceManager = new ServiceManager(process.env.ETCD_SERVER);

    var promiseFind = global.serviceManager.findService('dcm');

    promiseFind
        .then(function (v) {
            global.dcmURL = v;
        }, function (err) {
            global.dcmURL = null;
            console.log(err);
        });
}

app.ws = ws(wsPort);

consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);

var server = app.listen(htPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);

    var registerPromise = global.serviceManager
                .registerService('mc', config.get('host') + ':' + port);

    registerPromise
        .then(function () {
            console.log('Mission control registered with etcd'.green);
        }, function (err) {
            console.log('[ERROR] Registering with etcd: '.red + err);
        });
});
