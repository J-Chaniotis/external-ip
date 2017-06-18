'use strict';

const request = require('request');
const utils = require('./utils');

module.exports.setup = (config) => {

    const requestFactory = (request, url) => {
        return (cb) => {
            return request.get({
                url: url,
                timeout: config.timeout,
                headers: {
                    'User-Agent': 'curl/'
                }
            }, (error, res, body = '') => { 
                // if the body is null use an empty string
                if (error) {
                    return cb(error, null);
                }
                // Parse and validate the body
                body = body.toString().replace('\n', '');
                return cb.apply(null, utils.isIP(body) ? [null, body] : [new Error('Invalid IP'), null]);
            });
        };
    };

    return {
        requestFactory,
        services: config.services.map((url) => {
            return {
                getIP: (cb) => {
                    return requestFactory(request, url)(cb);
                },
                //url: url
            };
        })
    };

};