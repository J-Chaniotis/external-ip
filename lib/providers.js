'use strict';
/*
curlmyip.com, ifconfig.me/ip, ifconfig.co
*/
var request = require('request');
var utils = require('./utils');


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
    var url = 'http://curlmyip.com';
    request.get(url, function (err, res, body) {
        cb.apply(null, err ? [new Error(url + ': ' + err), null] : [null, body]);
    });
};

// slow
var ifconfigMe = function (cb) {
    var url = 'http://ifconfig.me/ip';
    request.get(url, function (err, res, body) {
        cb.apply(null, err ? [new Error(url + ': ' + err), null] : [null, body]);
    });
};

// Most reliable
var ifconfigCo = function (cb) {
    var url = 'http://ifconfig.co/x-real-ip';
    // Trick the server that we are using curl so it wont sent html
    request.get({
        'url': url,
        headers: {
            'User-Agent': 'curl/'
        }
    }, function (err, res, body) {
        cb.apply(null, err ? [new Error(url + ': ' + err), null] : [null, body]);
    });
};

module.exports = [ifconfigCo, ifconfigMe, curlmyipCom].map(function (provider) {
    return validate(provider);
});