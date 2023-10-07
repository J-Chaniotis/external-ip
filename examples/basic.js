'use strict';

const getIP = require('../index')();

getIP((err, ip) => {
    if (err) {
        throw err;
    }
    console.log(ip);
});