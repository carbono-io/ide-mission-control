'use strict';
var consign    = require('consign');
var express    = require('express');
var config     = require('config');
var ws         = require('socket.io');
var bodyParser = require('body-parser');
var app        = express();

var htPort = config.get('htPort');
var wsPort = config.get('wsPort');

// Parse JSON data in post requests
app.use(bodyParser.json());

app.ws = ws(wsPort);
app.authenticate = require('./app/authenticate').auth;
app.cm = [];

// allow cross-domain. see http://www.w3.org/TR/cors/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

consign({cwd: 'app'})
    .include('auth')
    .include('controllers')
    .include('routes')
    .into(app);

var server = app.listen(htPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Mission-Control listening at http://%s:%s', host, port);
    // Service discovery and registration
    require('carbono-service-manager');
});

module.exports = server;
