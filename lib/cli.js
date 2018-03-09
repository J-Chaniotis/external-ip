#!/usr/bin/env node

'use strict';
const program = require('commander');
const extIP = require('./extIP');
const pkg = require('../package.json');
const configSchema = require('./configSchema.json').properties;

const collect = (service, services = []) => {
    services.push(service);
    return services;
};

// Hack commander program name to match package name (for --help)
program._name = pkg.name;

program.usage('[options]')
    .version(pkg.version)
    .option('-R, --replace', 'replace internal services instead of extending them.')
    .option('-s, --services <url>', 'service url, see examples, required if using -R', collect)
    .option('-t, --timeout <ms>', 'set timeout per request', parseInt)
    .option('-P, --parallel', 'set to parallel mode')
    .option('-u, --userAgent <User-Agent>', `provide a User-Agent header, default: ${configSchema.userAgent.default}`, null, '')
    .option('-v, --verbose', 'provide additional details')
    .on('--help', () => {
        console.log(`
        This program prints the external IP of the machine.
        All arguments are optional.\n
        Examples:
        $ external-ip
        $ external-ip -P -t 1500 -R -s ${configSchema.services.default[0]} -s ${configSchema.services.default[1]}\n
        Default services:
        ${configSchema.services.default.join('\n \t')}\n
        Documentation can be found at ${pkg.homepage}\n`);
    })
    .parse(process.argv);

const generateConfig = (cliConf) => {
    return cliConf.options.reduce((acc, option) => {
        const name = option.name();
        if (cliConf[name]) {
            acc[name] = cliConf[name];
        }
        return acc;
    }, {
        // Patch config for parallel option.
        getIP: cliConf.parallel ? 'parallel' : undefined
    });
};

const config = generateConfig(program);


extIP(config)((err, ip) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    console.log(ip);
});