'use strict';

/*globals describe, it*/

const utils = require('../lib/utils');
const expect = require('chai').expect;
const configSchema = require('../lib/configSchema.json');


describe('utils.js test', function () {

    it('should be able to validate IPv4 and IPv6', function () {

        expect(utils.isIP('192.168.1.1')).to.equal(true);
        expect(utils.isIP('94.65.128.173')).to.equal(true);
        expect(utils.isIP('FE80:0000:0000:0000:0202:B3FF:FE1E:8329')).to.equal(true);
        expect(utils.isIP('FE80::0202:B3FF:FE1E:8329')).to.equal(true);

        expect(utils.isIP(111111)).to.equal(false);
        expect(utils.isIP('192..1.1')).to.equal(false);
        expect(utils.isIP('94.65.128.1A3')).to.equal(false);
        expect(utils.isIP('FE80:0000:0000:0000:0202:B3FF:FE1E:')).to.equal(false);
    });


    it('should allow valid config', function () {
        const config = {
            a: {
                replace: false,
                services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
                timeout: 500,
                getIP: 'sequential'
            },
            b: {
                services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
                timeout: 500,
                getIP: 'parallel'
            },
            c: {
                timeout: 500
            },
            // An empty object is valid config
            d: {},

            e: {
                replace: true,
                services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip']
            },
            f: {
                replace: true,
                services: ['http://ifconfig.co/x-real-ip']
            },
            g: {
                services: ['http://ifconfig.co/x-real-ip']
            },
        };

        const defaultLength = configSchema.properties.services.default.length;

        expect(utils.prepareConfig(config.a)).to.equal(null);
        expect(config.a.services.length).to.equal(defaultLength + 2);

        expect(utils.prepareConfig(config.b)).to.equal(null);
        expect(config.b.services.length).to.equal(defaultLength + 2);
        expect(config.b.timeout).to.equal(500);

        expect(utils.prepareConfig(config.c)).to.equal(null);
        expect(config.c.services.length).to.equal(defaultLength);
        expect(config.c.timeout).to.equal(500);

        // Check all the default values
        expect(utils.prepareConfig(config.d)).to.equal(null);
        expect(config.d.services.length).to.equal(defaultLength);
        expect(config.d.replace).to.equal(configSchema.properties.replace.default);
        expect(config.d.timeout).to.equal(configSchema.properties.timeout.default);
        expect(config.d.getIP).to.equal(configSchema.properties.getIP.default);
        expect(config.d.userAgent).to.equal(configSchema.properties.userAgent.default);
        expect(config.d.verbose).to.equal(configSchema.properties.verbose.default);

        expect(utils.prepareConfig(config.e)).to.equal(null);
        expect(config.e.services.length).to.equal(2);

        expect(utils.prepareConfig(config.f)).to.equal(null);
        expect(config.f.services.length).to.equal(1);


        expect(utils.prepareConfig(config.g)).to.equal(null);
        expect(config.g.services.length).to.equal(defaultLength + 1);

    });


    it('sould reject invalid config', function () {

        const config = {
            a: {
                replace: 'batman',
                services: [],
                timeout: 'robin',
                getIP: 'freeze'
            },
            b: {
                replace: true
            },
            c: {
                services: ['I am THE Batman']
            }
        };

        expect(utils.prepareConfig(config.a).length).equal(4);
        expect(utils.prepareConfig(config.b).length).equal(1);
        expect(utils.prepareConfig(config.c).length).equal(1);

    });

    it('Should return an IP for every service entry in the default configuration', function (done) {
        const defaultServices = configSchema.properties.services.default;
        const config = {
            timeout: 1000,
            userAgent: 'curl/'
        };
        // set the test timeout taking every request into account
        this.timeout(config.timeout * defaultServices.length);
        // configure a request for every service
        const requests = defaultServices.map((url) => utils.requestFactory(config, url));

        let completed = [];
        // hit them and validate the results
        requests.forEach((request) => {
            request((error, ip) => {
                expect(error).to.equal(null);
                expect(utils.isIP(ip)).to.equal(true);
                completed.push(ip);
                // Every service has responded
                if (completed.length === requests.length) {

                    // When runing on travis IPs will not be the same because of the infrastructure
                    if(process.env.TRAVIS) {
                        return done();
                    }
                    // Check if every IP is the same
                    return (!!completed.reduce((a, b) => a === b ? a : NaN)) ? done() : done(new Error('IP mismatch'));
                }
            });
        });

    });

    it('should be able to fail as expected when an service cant be found', function (done) {
        const config = {
            timeout: 1000,
            userAgent: 'curl/'
        };
        utils.requestFactory(config, 'http://i am doomed to fail cause i dont exist')((error, ip) => {
            expect(ip).to.equal(null);
            expect(error.message).to.contain('ENOTFOUND');
            done();
        });
    });

    it('should be able to fail as expected when an service wont return a valid IP', function (done) {
        const config = {
            timeout: 1000,
            userAgent: 'curl/'
        };
        utils.requestFactory(config, 'http://www.google.com')((error, ip) => {
            expect(ip).to.equal(null);
            expect(error.message).to.contain('invalid IP');
            done();
        });
    });

    it('should be able to format multiple error messages', function () {
        const error = utils.concatErrors([
            new Error('Software failure.'),
            new Error('Press left mouse button to continue'),
            new Error('Guru Meditation '),
        ]);
        expect(error.message).to.equal('Multiple errors: \n Software failure. \n Press left mouse button to continue \n Guru Meditation  \n');
    });

});