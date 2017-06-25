'use strict';
module.exports = {
    getIP: 'sequential', // parallel
    replace: false,
    services: [
        'http://icanhazip.com/',
        'http://ident.me/',
        'http://tnx.nl/ip',
        'http://myip.dnsomatic.com/',
        'http://ipecho.net/plain',
        'http://diagnostic.opendns.com/myip'
    ],
    timeout: 1000,
    userAgent: 'curl/',
    verbose: false
};