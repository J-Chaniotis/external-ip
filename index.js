'use strict';
var extIP = require('./lib/extIP');
var utils = require('./lib/utils');

module.exports = function (extConf) {
    extConf = extConf || {};

    var isValid = utils.validateConfig(extConf);

    if (isValid.errors.length) {
        console.error(isValid.errors);
        process.exit(1);
    }

    // Check: https://github.com/mjhasbach/MOIRA
    var defConf = {
        getIP: 'sequential', // parallel
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
        sequential: function (cb) {
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
            var requests;

            var abort = function (requests) {
                process.nextTick(function () {
                    requests.forEach(function (request) {
                        request.abort();
                    });
                });
            };


            var onResponse = function (err, ip) {

                if (done) {
                    return;
                }
                if (err) {
                    errors.push(err);
                }
                if(ip) {
                    done = true;
                    abort(requests); //async
                    return cb(null, ip);
                }
                if (errors.length === services.length) {
                    done = true;
                    abort(requests); //async
                    return cb(errors, null);
                }
            };

            requests = services.map(function (service) {
                return service.getIP(onResponse);
            });

        }
    };

    return getIP[config.getIP];
};