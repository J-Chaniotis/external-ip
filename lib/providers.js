'use strict';

var request = require('request');
var utils = require('./utils');

// Check: https://github.com/mjhasbach/MOIRA
var providers = [
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
            body = body.replace('\n', '');
            return cb.apply(null, utils.isIP(body) ? [null, body] : [new Error('Invalid IP'), null]);

        });
    };
};

var requestFactory = function (url) {
    return function (cb) {
        request.get({
            'url': url,
            headers: {
                'User-Agent': 'curl/'
            }
        }, function (err, res, body) {
            cb.apply(null, err ? [err, null] : [null, body]);
        });
    };
};


module.exports = providers.map(function (url) {
    return {
        getIP: addValidation(requestFactory(url)),
        url: url
    };
});