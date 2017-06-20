'use strict';

const revalidator = require('revalidator');
const net = require('net');
const get = require('simple-get');

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

const requestFactory = (config, url) => {
    return (cb) => {
        return get.concat({
            url: url,
            timeout: config.timeout,
            headers: {
                'User-Agent': 'curl/'
            }
        }, (error, res, body = '') => { // if the body is falsey use an empty string
            if (error) {
                return cb(new Error(`${error.message} from ${url}`), null);
            }
            // Parse and validate the body
            body = body.toString().replace('\n', '');
            return cb.apply(null, isIP(body) ? [null, body] : [new Error(`Got invalid IP from ${url}`), null]);
        });
    };
};

const concatErrors = (errors) => {
    if (errors.length === 1) {
        return errors[0];
    }
    let msg = errors.reduce((acc, current) => {
        return acc + ` ${current.message} \n`;
    }, 'Multiple errors: \n');
    return new Error(msg);
};

module.exports = {
    isIP,
    validateConfig,
    mergeConfig,
    requestFactory,
    concatErrors
};