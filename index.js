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
                    err = providers[i].url + ' : ' + err;
                    console.log(err);
                    errors.push(err);
                    next();
                } else {
                    stop(ip);
                }
            });
        },
        done: function (ip) {
            cb.apply(null, ip ? [null, ip] : [errors, null]);
        }
    });
};