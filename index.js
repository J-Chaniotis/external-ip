'use strict';

var providers = require('./lib/loader').providers;
var utils = require('./lib/utils');


var getIP = function (cb) {
    utils.asyncLoop({
        iterations: providers.length,
        exec: function (i, stop, next) {
            providers[i].getIP(function (err, ip) {
                
            });
        },
        done: function () {

        }
    });
};


module.exports.getIP = getIP;