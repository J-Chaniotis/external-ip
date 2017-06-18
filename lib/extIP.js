'use strict';
const utils = require('./utils');
const defaultConfig = require('./defaultConfig');

module.exports = (externalConfig = {}) => {

    const isValid = utils.validateConfig(externalConfig);

    if (isValid.errors.length) {
        console.error(isValid.errors);
        process.exit(1);
    }

    const config = utils.mergeConfig(externalConfig, defaultConfig);
    const requests = config.services.map((url) => utils.requestFactory(config, url));

    var getIP = {
        sequential: (cb) => {
            let current = 0;
            let errors = [];

            const loop = () => {
                requests[current]((error, ip) => {
                    if (error) {
                        //errors.push(service.url + ' : ' + err);
                        errors.push(error);
                        current += 1;
                        if (current === requests.length) {
                            return cb(errors, null);
                        }
                        return loop();
                    }
                    return cb(null, ip);
                });
            };
            loop();
        },

        parallel: (cb) => {
            let done = false;
            let errors = [];
            let ongoingRequests;

            const abort = (requests) => {
                process.nextTick(() => {
                    requests.forEach((request) => {
                        request.abort();
                    });
                });
            };


            const onResponse = function (err, ip) {

                if (done) {
                    return;
                }
                if (err) {
                    errors.push(err);
                }
                if (ip) {
                    done = true;
                    abort(ongoingRequests); //async
                    return cb(null, ip);
                }
                if (errors.length === requests.length) {
                    done = true;
                    abort(ongoingRequests); //async
                    return cb(errors, null);
                }
            };

            ongoingRequests = requests.map((service) => service(onResponse));

        }
    };

    return getIP[config.getIP];
};