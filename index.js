'use strict';
var services = require('./lib/services').services;
var utils = require('./lib/utils');

module.exports = function (cb) {
    var errors = [];
    utils.asyncLoop({
        iterations: services.length,
        exec: function (i, stop, next) {
            services[i].getIP(function (err, ip) {
                if (err) {
                    err = services[i].url + ' : ' + err;
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