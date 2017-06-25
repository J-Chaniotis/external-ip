#!/usr/bin/env node

'use strict';
const program = require('commander');
const extIP = require('./extIP');
const pkg = require('../package.json');
const defaultConfig = require('./defaultConfig');

const collect = (service, services) => {
    services.push(service);
    return services;
};

// Hack commander program name to match package name (for --help)
program._name = pkg.name;

program.on('--help', () => {
    console.log(`
        This program prints the external IP of the machine.
        All arguments are optional.\n
        Examples:
        $ external-ip
        $ external-ip -P -t 1500 -R -s ${defaultConfig.services[0]} -s ${defaultConfig.services[1]}\n
        Default services:
        ${defaultConfig.services.join('\n \t')}\n
        Documentation can be found at ${pkg.homepage}\n`);
});

program
    .usage('[options]')
    .version(pkg.version)
    .option('-R, --replace', 'replace internal services instead of extending them.')
    .option('-s, --services <url>', 'service url, see examples, required if using -R', collect, [])
    .option('-t, --timeout <ms>', 'set timeout per request', parseInt)
    .option('-P, --parallel', 'set to parallel mode')
    .option('-u, --userAgent <User-Agent>', `provide a User-Agent header, default: ${defaultConfig.userAgent}`, null, '')
    .option('-v, --verbose', 'provide additional details')
    .parse(process.argv);

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
    if (cliConf.userAgent) {
        config.userAgent = cliConf.userAgent;
    }

    if (cliConf.verbose) {
        config.verbose = cliConf.verbose;
    }
    return config;
};


const getIP = extIP(generateConfig(program));

getIP((err, ip) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(ip);
});