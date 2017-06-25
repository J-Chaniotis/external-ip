'use strict';
const { promisify } = require('util');
const getIP = promisify(require('../index')({
    replace: true, // true: replace the default services list, false: extend it, default: false
    services: ['http://icanhazip.com/', 'http://ident.me/'],
    timeout: 600, // set timeout per request, default: 500ms
    getIP: 'parallel',
    verbose: true
}));

getIP().then((ip) => {
    console.log(ip);
}).catch((error) => {
    console.error(error);
});