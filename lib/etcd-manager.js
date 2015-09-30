/* global process */
'use strict';
var config          = require('config');
var ServiceManager  = require('carbono-service-manager');
require('colors');

var singleton = function singleton(){
    this._serviceManager  = null;
    var _services        = {};
    
    /**
    * Initialize the communication with etcd. An environment variable named
    * ETCD_SERVER must exist, with a URL location to access the service.
    * After comm is set then it registers the module on etcd. 
    *
    * @function
    */
    this._init = function (key, alias, host, port) {
        
        if (!key || !alias || !host || !port) {
            console.log('ETCD not configured! Please check config.'
                .bold.red);
            throw new Error('No etcd configuration.');
        }
        
        if (typeof process.env.ETCD_SERVER === 'undefined') {
            console.log('The environment variable ETCD_SERVER is not defined!'
                .bold.red);
            console.log('Please, define it before continuing, otherwise the'
                .red);
            console.log('integration will not work!'.red);
            console.log();
            throw new Error('No etcd running.');
        }
        
        this._serviceManager = new ServiceManager(process.env.ETCD_SERVER);
        var promise = this._serviceManager.registerService(key, host + ':' + port);
        promise.then(
            function onResolve() {
                var msg = '+ Module ' + alias + ' registered with etcd.';
                console.log(msg.yellow);
                
            }, function onReject(err) {
                console.log('[ERROR] Registering with etcd: '.red +
                    JSON.stringify(err));
                throw err;
                
            }).catch(function onError(err){
                process.exit();
            }
        );
    };
    
    
    /**
    * (Internal) Helper function to find specifics services in Etcd Manager
    *
    * @param serviceKey  The Key to be found in the Etdc Manager
    * @param serviceName Friendly name to the service, only useful for logging
    * @param _cb         Callback function which will receive the service URL
    */
    this._serviceFinder = function (serviceKey, serviceName) {
        serviceName = serviceName || serviceKey;
        if (!this._serviceManager) {
            throw new Error('Etcd-manager singleton failed fatally.');
        }
        var promise = this._serviceManager.findService(serviceKey);
        promise.then(
            function onResolve(url) {
                var msg = '- Service ' + serviceName + ' found at etcd.';
                console.log(msg.green);
                _services[serviceKey] = url;
                
            }, function onReject(err) {
                var msg = '[ERROR] Finding ' + serviceName + ' with etcd: ';
                console.log(msg.red + JSON.stringify(err));
                throw err;
                
            }).catch(function onError(err){
                console.log(err);
                process.exit();
            });
    }
    
    /**
    * Try to get url retrieved by etcd.
    *
    * @function
    * @param {string} Service name.
    * @return {string} A url.
    */
    this.getServiceUrl = function (key) {
        return _services[key];
    };
    
}
 
/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
singleton.instance = null;
 
/**
 * Singleton getInstance definition
 * @return singleton class
 */
singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
        var etcd = this.instance;
        var cfg  = config.get('etcd');
        try{
            etcd._init(cfg.key, cfg.alias, cfg.host, cfg.port);
            cfg.hosts.forEach(function(host) {
                etcd._serviceFinder(host.key, host.alias);
            });
            
        }catch(err){
            var msg = '\n[ERROR] ' + err.message;
            console.log(msg.bold.red);
            process.exit();
        }
    }
    return this.instance;
}
 
module.exports = singleton.getInstance();