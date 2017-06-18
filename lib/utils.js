'use strict';

const revalidator = require('revalidator');
const net = require('net');

/**
 * @param str
 * @return boolean
 */
const isIP = (str) => net.isIP(str) !== 0;


const validateConfig = (config) => {
    return revalidator.validate(config, {
        properties: {
            replace: {
                description: 'true: replaces the default services, false: extends them',
                type: 'boolean',
                allowEmpty: false,
                dependencies: 'services'
            },
            services: {
                description: 'array of urls that return the ip in the document body',
                type: 'array',
                minItems: 1,
                allowEmpty: false,
                format: 'url'
            },
            timeout: {
                description: 'timeout per request',
                type: 'integer',
                allowEmpty: false
            },
            getIP: {
                description: 'sequential or parallel ip fetching',
                type: 'string',
                allowEmpty: false,
                enum: ['parallel', 'sequential']
            }
        }
    });
};


const mergeConfig = (externalConfig, defaultConfig) => {
    return {
        services: externalConfig.replace ? externalConfig.services : externalConfig.services && defaultConfig.services.concat(externalConfig.services) || defaultConfig.services,
        timeout: externalConfig.timeout || defaultConfig.timeout,
        getIP: externalConfig.getIP || defaultConfig.getIP
    };
};


module.exports = {
    isIP,
    validateConfig,
    mergeConfig
};