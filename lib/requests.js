'use strict';

const request = require('request');
const utils = require('./utils');

module.exports.setup = function (config) {

    const requestFactory = function (request, url) {
        return function (cb) {
            return request.get({
                url: url,
                timeout: config.timeout,
                headers: {
                    'User-Agent': 'curl/'
                }
            }, function (err, res, body) {
                cb.apply(null, err ? [err, null] : [null, body]);
            });
        };
    };

    const initializeServices = function (services) {
        return services.map(function (url) {
            return {
                getIP: function (cb) {
                    return requestFactory(request, url)(function (err, body) {
                        if (err) {
                            return cb(err, null);
                        }
                        // if the body is null use an empty string
                        body = (body || '').toString().replace('\n', '');
                        return cb.apply(null, utils.isIP(body) ? [null, body] : [new Error('Invalid IP'), null]);

                    });
                },
                url: url
            };
        });
    };

    return {
        requestFactory,
        initializeServices,
        services: initializeServices(config.services)
    };

};