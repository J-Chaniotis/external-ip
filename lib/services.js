'use strict';

var request = require('request');
var utils = require('./utils');

// Check: https://github.com/mjhasbach/MOIRA
var services = [
    'http://ifconfig.co/x-real-ip',
    'http://ifconfig.me/ip',
    'http://icanhazip.com/',
    'http://ip.appspot.com/',
    'http://curlmyip.com/',
    'http://ident.me/',
    'http://whatismyip.akamai.com/',
    'http://tnx.nl/ip',
    'http://myip.dnsomatic.com/',
    'http://ipecho.net/plain'
];


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
            timeout: 500,
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

module.exports = {
    services: initializeServices(services),
    // Expose for testing
    addValidation: addValidation,
    requestFactory: requestFactory,
    initializeServices: initializeServices
};