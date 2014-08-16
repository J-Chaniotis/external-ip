'use strict';

var getIP = require('./index');

getIP(function (err, ip) {
    console.log(err, ip);
});
