'use strict';
const {promisify} = require('util');
const getIP = promisify(require('../index')());

getIP().then((ip)=> {
    console.log(ip);
}).catch((error) => {
    console.error(error);
});
