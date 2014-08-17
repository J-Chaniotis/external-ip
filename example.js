'use strict';

var getIP = require('./index').getIP;

getIP(function (err, ip) {
    console.log(err, ip);
});
