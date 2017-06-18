#!/usr/bin/env node

'use strict';
const program = require('commander');
const extIP = require('./extIP');

const collect = (service, services) => {
    services.push(service);
    return services;
};

program
    .option('-R, --replace', 'replace internal services instead of extending them.')
    .option('-s, --services <url>', 'service url, see examples, required if using -R', collect, [])
    .option('-t, --timeout <msec>', 'set timeout per request', parseInt)
    .option('-P, --parallel', 'set to parallel mode');


program.on('--help', () => {
    console.log('This program prints the external IP of the machine.\n' +
        'All arguments are optional.');
    console.log('Examples:');
    console.log('$ external-ip');
    console.log('$ external-ip -P -t 1500 -R -s http://icanhazip.com/ -s http://ifconfig.io/ip');
});

program.parse(process.argv);


const generateConfig = (cliConf) => {
    let config = {};
    config.getIP = cliConf.parallel ? 'parallel' : 'sequential';
    if (cliConf.timeout) {
        config.timeout = cliConf.timeout;
    }
    if (cliConf.replace) {
        config.replace = cliConf.replace;
    }
    if (cliConf.services.length) {
        config.services = cliConf.services;
    }
    return config;
};


const getIP = extIP(generateConfig(program));

getIP((err, ip) =>{
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(ip);
});