'use strict';

var request = require('request');
var utils = require('./utils');

module.exports.setup = function (config) {


    var addValidation = function (provider) {
        return function (cb) {
            provider(function (err, body) {
                if (err) {
                    return cb(err, null);
                }
                body = (body || '').toString();
                body = body.replace('\n', '');
                return cb.apply(null, utils.isIP(body) ? [null, body] : [new Error('Invalid IP'), null]);

            });
        };
    };

    var requestFactory = function (request, url) {
        return function (cb) {
            request.get({
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

    var initializeServices = function (services) {
        return services.map(function (url) {
            return {
                getIP: addValidation(requestFactory(request, url)),
                url: url
            };
        });
    };

    return {
        addValidation: addValidation,
        requestFactory: requestFactory,
        initializeServices: initializeServices,
        services: initializeServices(config.services)
    };

};