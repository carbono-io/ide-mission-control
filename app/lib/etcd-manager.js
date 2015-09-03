'use strict'

var config          = require('config');
var ServiceManager  = require('carbono-service-manager');
require('colors');

var MC_SERVICE_KEY  = 'mc';
var DCM_SERVICE_KEY = 'dcm';

var dcmURL          = null;
var serviceManager  = null;
var registered      = false;

/**
 * This class acts as a 'wrapper' for carbono-service-manager module, which is
 * responsible to register and find services.
 *
 * @class EtcdManager
 */
var EtcdManager = function() {
    return this;
}


/**
 * Initialize the communication with etcd. An environment variable named
 * ETCD_SERVER must exist, with a URL location to access etcd.
 *
 * @function
 */
EtcdManager.prototype.init = function() {
    if (typeof process.env.ETCD_SERVER === 'undefined') {
        console.log('The environment variable ETCD_SERVER is not defined!'
            .bold.red);
        console.log('Please, define it before continuing, otherwise the'
            .red);
        console.log('integration will not work!'.red);
        console.log();
    } else {
        this.serviceManager = new ServiceManager(process.env.ETCD_SERVER);

        this.findDCM();
        this.register();
    }
};

/**
 * Try to register this service as a Mission Control service ('mc'). It
 * uses the config file to determine the correct URL to access this service.
 *
 * @function
 */
EtcdManager.prototype.register = function() {
    if (this.serviceManager) {
        var promise = this.serviceManager.registerService(
            MC_SERVICE_KEY,
            config.get('host') + ':' + config.get('htPort')
        );

        promise.then(
            function() {
                console.log('Mission control registered with etcd'.green);
                registered = true;
            }, function (err) {
                console.log('[ERROR] Registering with etcd: '.red
                    + JSON.stringify(err));
                registered = false;
            });
    }
};

/**
 * Try to find Development Container Manager ('dcm') service. It saves the
 * URL at this.dcmURL.
 *
 * @function
 */
EtcdManager.prototype.findDCM = function() {
    if (this.serviceManager) {
        var promise = this.serviceManager.findService(DCM_SERVICE_KEY);

        promise.then(
            function (url) {
                console.log('Development Container Manager found at etcd'
                    .green);
                dcmURL = url;
            }, function (err) {
                console.log('[ERROR] Finding DCM with etcd: '.red
                    + JSON.stringify(err));
                dcmURL = null;
            });
    }
};

/**
 * Try to get DCM url retrieved by etcd.
 *
 * @function
 * @return {String} dcmURL A url to access the DCM
 */
EtcdManager.prototype.getDcmUrl = function() {
    return dcmURL;
};

module.exports = EtcdManager;
