'use strict';

const extIP = require('../index');

const getIP = extIP({
    replace: true, // true: replace the default services list, false: extend it, default: false
    services: ['https://ipinfo.io/ip', 'http://icanhazip.com/', 'http://ident.me/'],
    timeout: 600, // set timeout per request, default: 500ms
    getIP: 'parallel'
});

getIP((err, ip) => {
    if (err) {
        throw err;
    }
    console.log(ip);
});
