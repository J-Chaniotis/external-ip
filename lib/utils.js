'use strict';

const revalidator = require('revalidator');
const net = require('net');
const get = require('simple-get');

/**
 * Minimal logger implementation for verbose mode
 * @param  {Object} config
 * @return {Object} logger instance
 */
const loggerFactory = (config) => {
    const noop = () => {};
    return {
        error: config.verbose ? console.log.bind(console, '[error]: ') : noop,
        info: config.verbose ? console.log.bind(console, '[info]: ') : noop
    };
};

/**
 * Checks if an IP is a valid v4 or v6
 * @param str
 * @return boolean
 */
const isIP = (str) => net.isIP(str) !== 0;

/**
 * Validate the configuration object using jsonschema
 * @param  {Object} config
 * @return {Object} Errors in config if present
 */
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
            },
            userAgent: {
                description: 'Customize the User-Agent header',
                type: 'string',
                allowEmpty: false
            }
        }
    });
};

/**
 * Merges the external configuration with the default
 * @param  {Object} externalConfig
 * @param  {Object} defaultConfig
 * @return {Object}
 */
const mergeConfig = (externalConfig, defaultConfig) => {
    return {
        services: externalConfig.replace ? externalConfig.services : externalConfig.services && defaultConfig.services.concat(externalConfig.services) || defaultConfig.services,
        timeout: externalConfig.timeout || defaultConfig.timeout,
        getIP: externalConfig.getIP || defaultConfig.getIP,
        userAgent: externalConfig.userAgent || defaultConfig.userAgent,
        verbose: externalConfig.verbose || defaultConfig.verbose
    };
};

/**
 * Creates a reusable request
 * @param  {Object} config
 * @param  {string} url
 * @return {Function} cb(error, ip)
 */
const requestFactory = (config, url) => {
    const logger = loggerFactory(config);
    return (cb) => {
        logger.info(`requesting IP from: ${url}`);
        return get.concat({
            url: url,
            timeout: config.timeout,
            headers: {
                'User-Agent': config.userAgent
            }
        }, (error, res, body = '') => { // if the body is falsey use an empty string
            if (error) {
                logger.error(`${url} ${error.message}`);
                return cb(new Error(`${error.message} from ${url}`), null);
            }
            // Parse and validate the body
            body = body.toString().replace('\n', '');
            if (isIP(body)) {
                logger.info(`got valid IP from: ${url}`);
                return cb(null, body);
            }
            logger.error(`Got invalid IP from ${url}`);
            return cb(new Error(`Got invalid IP from ${url}`), null);
        });
    };
};

/**
 * Used to prety-ish print the errors
 * @param  {Array} errors
 * @return {Error}
 */
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