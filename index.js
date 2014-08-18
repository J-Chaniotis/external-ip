'use strict';
var extIP = require('./lib/extIP');
var utils = require('./lib/utils');

module.exports = function (extConf) {
    extConf = extConf || {};

    var extValid = utils.validateConfig(extConf);

    if (extValid.errors.length) {
        throw new Error(extConf.errors);
    }

    // Check: https://github.com/mjhasbach/MOIRA
    var defConf = {
        getIP: 'sequencial', // parallel
        replace: false,
        services: [
            'http://ifconfig.co/x-real-ip',
            'http://icanhazip.com/',
            'http://ifconfig.me/ip',
            'http://ip.appspot.com/',
            'http://curlmyip.com/',
            'http://ident.me/',
            'http://whatismyip.akamai.com/',
            'http://tnx.nl/ip',
            'http://myip.dnsomatic.com/',
            'http://ipecho.net/plain'
        ],
        timeout: 500
    };

    var config = utils.mergeConfig(extConf, defConf);

    var services = extIP.setup(config).services;


    var getIP = {
        sequencial: function (cb) {
            var errors = [];
            utils.asyncLoop({
                iterations: services.length,
                exec: function (i, stop, next) {
                    services[i].getIP(function (err, ip) {
                        if (err) {
                            err = services[i].url + ' : ' + err;
                            errors.push(err);
                            next();
                        } else {
                            stop(ip);
                        }
                    });
                },
                done: function (ip) {
                    cb.apply(null, ip ? [null, ip] : [errors, null]);
                }
            });
        },

        parallel: function (cb) {
            var done = false;
            var errors = [];

            var onResponse = function (err, ip) {

                if (done) {
                    return;
                }
                if (err) {
                    errors.push(err);
                }
                if (ip || errors.length === services.length) {
                    done = true;
                    cb.apply(null, ip ? [null, ip] : [errors, null]);
                }
            };
            // Abort at somepoint....
            var requests = services.map(function (service) {
                return service.getIP(onResponse);
            });

        }
    };

    return getIP[config.getIP];
};