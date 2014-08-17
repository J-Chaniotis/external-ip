'use strict';

var extIP = require('../index');

var getIP = extIP({
    replace: true, // true: replace the default services list, false: extend it, default: false
    services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.me/ip'],
    timeout: 600 // set service timeout in ms, default: 500
});

getIP(function (err, ip) {
    if (err) {
        throw err;
    }
    console.log(ip);
});
