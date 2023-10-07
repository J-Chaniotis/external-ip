'use strict';

const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true,
    useDefaults: true
});
const configSchema = require('./configSchema.json');
const net = require('net');
const get = require('simple-get');

/**
 * Minimal logger implementation for verbose mode
 * @param  {Boolean} config.verbose
 * @return {Object} logger instance
 */
const loggerFactory = ({ verbose }) => {
    const noop = () => {};
    return {
        error: verbose ? console.log.bind(console, '[error]: ') : noop,
        info: verbose ? console.log.bind(console, '[info]: ') : noop
    };
};

/**
 * Checks if an IP is a valid v4 or v6
 * @param str
 * @return boolean
 */
const isIP = (str) => net.isIP(str) !== 0;

/**
 * Use user provided service list or extend the default service list
 * @param  {Boolean} options.replace  should replace or not the default service list
 * @param  {Array}  options.services  user provided service list or an empry array
 * @return {Array}                    service list
 */
const prepareServiceList = ({ replace, services = []}) => {
    return replace ? services : [...services, ...configSchema.properties.services.default];
};

/**
 * Prepare the configuration object.
 * Validate using jsonschema and apply the required defaults 
 * @param  {Object} config
 * @return {Object} Errors in config if present
 */
const prepareConfig = (config) => {
    // Merge or extend services acordingly 
    config.services = prepareServiceList(config);

    const validate = ajv.compile(configSchema);
    validate(config);

    return validate.errors;
};

/**
 * Creates a reusable request
 * @param  {Object} config
 * @param  {string} url
 * @return {Function} cb(error, ip)
 */
const requestFactory = ({verbose, timeout, userAgent}, url) => {
    const logger = loggerFactory({verbose});
    return (cb) => {

        logger.info(`requesting IP from: ${url}`);
        const startTime = Date.now();

        return get.concat({
            url,
            timeout,
            headers: {
                'User-Agent': userAgent
            }
        }, (error, res, body = '') => { // if the body is falsey use an empty string
            if (error) {
                logger.error(`${url} ${error.message}`);
                return cb(new Error(`${error.message} from ${url}`), null);
            }
            // Parse and validate the body
            body = body.toString().replace('\n', '');
            if (isIP(body)) {
                logger.info(`got valid IP from: ${url} in ${Date.now()- startTime}ms`);
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
    prepareConfig,
    requestFactory,
    concatErrors
};