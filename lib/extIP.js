'use strict';
const requests = require('./requests');
const utils = require('./utils');

const defaultConfig = {
    getIP: 'sequential', // parallel
    replace: false,
    services: [
        //'http://ip.appspot.com/',
        //'http://ifconfig.co/x-real-ip',
        //'http://ifconfig.io/ip',
        'http://icanhazip.com/',
        'http://ident.me/',
        'http://whatismyip.akamai.com/',
        'http://tnx.nl/ip',
        'http://myip.dnsomatic.com/',
        'http://ipecho.net/plain',
        'http://diagnostic.opendns.com/myip'
    ],
    timeout: 1000
};

module.exports = (externalConfig = {}) => {

    const isValid = utils.validateConfig(externalConfig);

    if (isValid.errors.length) {
        console.error(isValid.errors);
        process.exit(1);
    }

    const config = utils.mergeConfig(externalConfig, defaultConfig);

    var services = requests.setup(config).services;

    var getIP = {
        sequential: function (cb) {
            let current = 0;
            let errors = [];

            const loop = () => {
                services[current].getIP((error, ip) => {
                    if (error) {
                        //errors.push(service.url + ' : ' + err);
                        errors.push(error);
                        current += 1;
                        if (current === services.length) {
                            return cb(errors, null);
                        }
                        return loop();
                    }
                    return cb(null, ip);
                });
            };
            loop();
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
                if (ip) {
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