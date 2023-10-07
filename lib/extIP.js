'use strict';
const utils = require('./utils');

module.exports = (config = {}) => {

    // validate the external configuration and add the default values where needed
    const configErrors = utils.prepareConfig(config);
    if (configErrors) {
        throw utils.concatErrors(configErrors);
    }

    // create a request instance for each service in the configuration
    const requests = config.services.map((url) => utils.requestFactory(config, url));

    // sequential and parallel mode handlers
    const getIP = {
        sequential: (cb) => {
            let errors = [];
            let current = 0;

            const loop = () => {
                requests[current]((error, ip) => {
                    if (error) {
                        errors.push(error);
                        current += 1;
                        // when every single service has failed tell the bad news
                        if (errors.length === requests.length) {
                            return cb(utils.concatErrors(errors), null);
                        }
                        // try the next one
                        return loop();
                    }
                    // got an ip
                    return cb(null, ip);
                });
            };
            // initiate the first request
            loop();
        },

        parallel: (cb) => {
            let done = false;
            let errors = [];
            let ongoingRequests;

            let onResponse = (error, ip) => {
                // got an ip from a previous request, so there is nothing to do here
                if (done) {
                    return;
                }

                if (error) {
                    errors.push(error);
                }

                // when every single service has failed tell the bad news
                if (errors.length === requests.length) {
                    return cb(utils.concatErrors(errors), null);
                }

                if (ip) {
                    done = true;
                    // Abort every pending request
                    ongoingRequests.forEach((request) => request.abort());
                    return cb(null, ip);
                }
            };

            // initiate all the requests
            ongoingRequests = requests.map((service) => service(onResponse));

        }
    };

    // return the sequential or the parallel handler according to the configuration
    return getIP[config.getIP];
};