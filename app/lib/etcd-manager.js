'use strict';
var config          = require('config');
var ServiceManager  = require('carbono-service-manager');
require('colors');

var MC_SERVICE_KEY  = 'mc';
var DCM_SERVICE_KEY = 'dcm';
var IPE_SERVICE_KEY = 'ipe';

var dcmURL          = null;
var ipeURL          = null;
var serviceManager  = null;
var registered      = false;

/**
 * This class acts as a 'wrapper' for carbono-service-manager module, which is
 * responsible to register and find services.
 *
 * @class EtcdManager
 */
var EtcdManager = function () {
    return this;
};

/**
 * Initialize the communication with etcd. An environment variable named
 * ETCD_SERVER must exist, with a URL location to access etcd.
 *
 * @function
 */
EtcdManager.prototype.init = function () {
    if (typeof process.env.ETCD_SERVER === 'undefined') {
        console.log('The environment variable ETCD_SERVER is not defined!'
            .bold.red);
        console.log('Please, define it before continuing, otherwise the'
            .red);
        console.log('integration will not work!'.red);
        console.log();
    } else {
        serviceManager = new ServiceManager(process.env.ETCD_SERVER);

        this.findDCM();
        this.findIPE();
        this.register();
    }
};

/**
 * Try to register this service as a Mission Control service ('mc'). It
 * uses the config file to determine the correct URL to access this service.
 *
 * @function
 */
EtcdManager.prototype.register = function () {
    if (serviceManager) {
        var promise = serviceManager.registerService(
            MC_SERVICE_KEY,
            config.get('host') + ':' + config.get('htPort')
        );

        promise.then(
            function () {
                console.log('Mission control registered with etcd'.green);
                registered = true;
            }, function (err) {
                console.log('[ERROR] Registering with etcd: '.red +
                    JSON.stringify(err));
                registered = false;
            });
    }
};

/**
 * (Internal) Helper function to find specifics services in Etcd Manager
 *
 * @param serviceKey  The Key to be found in the Etdc Manager
 * @param serviceName Friendly name to the service, only useful for logging
 * @param _cb         Callback function which will receive the service URL
 */
function serviceFinder(serviceKey, serviceName, _cb) {
    serviceName = serviceName || serviceKey;
    if (serviceManager) {
        var promise = serviceManager.findService(serviceKey);

        promise.then(
            function (url) {
                var msg = serviceName + 'found at etcd';
                console.log(msg.green);
                _cb(url);
            }, function (err) {
                var msg = '[ERROR] Finding ' + serviceName + ' with etcd: ';
                console.log(msg.red + JSON.stringify(err));
                _cb(null);
            });
    } else {
        _cb(null);
    }
}

/**
 * Try to find Development Container Manager ('dcm') service. It saves the
 * URL at this.dcmURL.
 *
 * @function
 */
EtcdManager.prototype.findDCM = function () {
    serviceFinder(DCM_SERVICE_KEY, 'Development Container Manager',
        function (url) {
            dcmURL = url;
        });
};

/**
 * Try to find the Mogno-IPE host ('ipe'). It saves the URL at this.ipeURL.
 */
EtcdManager.prototype.findIPE = function () {
    serviceFinder(IPE_SERVICE_KEY, 'Mogno IPE', function (url) {
        ipeURL = url;
    });
};

/**
 * Try to get DCM url retrieved by etcd.
 *
 * @function
 * @return {string} dcmURL A url to access the DCM
 */
EtcdManager.prototype.getDcmUrl = function () {
    return dcmURL;
};

/**
 * Try to get IPE url retrieved by etcd.
 *
 * @return {string} ipeURL A url to access the mogno-IPE address
 */
EtcdManager.prototype.getIpeUrl = function () {
    return ipeURL;
};

module.exports = EtcdManager;
