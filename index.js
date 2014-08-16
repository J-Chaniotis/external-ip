'use strict';
var providers = require('./lib/providers');
var utils = require('./lib/utils');

module.exports = function (cb) {
    var errors = [];
    utils.asyncLoop({
        iterations: providers.length,
        exec: function (i, stop, next) {
            providers[i].getIP(function (err, ip) {
                if (err) {
                    errors.push(err);
                    next();
                } else {
                    stop(ip);
                }
            });
        },
        done: function (ip) {
            if (! ip) {
                cb(errors, null);
            } else {
                cb(null, ip);
            }
        }
    });
};