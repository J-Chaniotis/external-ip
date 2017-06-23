'use strict';

/*globals it, describe*/

// Integration test
const utils = require('../lib/utils');
const defaultConfig = require('../lib/defaultConfig');
const expect = require('chai').expect;

const timeout = 2000;

describe('defaultConfig.js test', () => {
    it('Should return an IP for every service entry in the default configuration', function (done) {
        // set the timeout taking every request into account
        this.timeout(timeout * defaultConfig.services.length);
        // configure a request for every service
        const requests = defaultConfig.services.map((url) => utils.requestFactory({ timeout, userAgent: defaultConfig.userAgent }, url));
        let completed = 0;
        // hit them and validate the results
        requests.forEach((request) => {
            request((err, ip) => {
                expect(err).to.equal(null);
                expect(utils.isIP(ip)).to.equal(true);
                completed += 1;

                if (completed === requests.length) {
                    done();
                }
            });
        });

    });
});