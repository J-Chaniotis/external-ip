'use strict';

var request = require('request');
var net = require('net');

module.exports.setup = function (config) {


    var addValidation = function (request) {
        return function (cb) {
            return request(function (err, body) {
                if (err) {
                    return cb(err, null);
                }
                // if the body is null use an empty string
                body = (body || '').toString().replace('\n', '');
                return cb.apply(null, net.isIP(body) != 0 ? [null, body] : [new Error('Invalid IP'), null]);

            });
        };
    };

    var requestFactory = function (request, url) {
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