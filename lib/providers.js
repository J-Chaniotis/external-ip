'use strict';
/*
curlmyip.com, ifconfig.me/ip, ifconfig.co
*/
var request = require('request');
var utils = require ('./utils');


var validate = function (provider) {
    return function (cb) {
        provider(function (err, body) {
            if (err) {
                return cb(err, null);
            }

            body = body.replace('\n', '');
            if (utils.isIP(body)) {
                return cb(null, body);
            }
            cb(new Error('Invalid IP'), null);
        });
    };
};

// flaky
var curlmyipCom = function (cb) {
    request.get('http://curlmyip.com', function (err, res, body) {
        cb.apply(null, err ? [err, null] : [null, body]);
    });
};

// slow
var ifconfigMe = function (cb) {
    request.get('http://ifconfig.me/ip', function (err, res, body) {
        cb.apply(null, err ? [err, null] : [null, body]);
    });
};

// Most reliable
var ifconfigCo = function (cb) {
    // Trick the server that we are using curl so it wont sent html
    request.get({
        'url': 'http://ifconfig.co/x-real-ip',
        headers: {
            'User-Agent': 'curl/'
        }
    }, function (err, res, body) {
        cb.apply(null, err ? [err, null] : [null, body]);
    });
};

module.exports = [ifconfigCo, ifconfigMe, curlmyipCom].map(function (provider) {
    return validate(provider);
});
