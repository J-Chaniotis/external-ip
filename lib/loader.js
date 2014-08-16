'use strict';

var fs = require('fs');
var path = require('path');

var providersDir = path.join(__dirname, './providers');

/*
Loads all modules inside ./providers and exports an array of objects
*/
module.exports.providers =  fs.readdirSync(providersDir)
    .filter(function (fname) {
        return path.extname(fname) === '.js';
    })
    .map(function (fname) {
        return require(path.join(providersDir, fname));
    });
