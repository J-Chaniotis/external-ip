'use strict';

/*globals describe, it*/

var utils = require('../lib/utils');
var expect = require('chai').expect;


describe('utils.js test', function () {

    it('should allow valid config', function () {
        var config = {
            a: {
                replace: false,
                services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
                timeout: 500,
                gerIP: 'sequential'
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
            d: {}
        };

        expect(utils.validateConfig(config.a).valid).to.equal(true);
        expect(utils.validateConfig(config.b).valid).to.equal(true);
        expect(utils.validateConfig(config.c).valid).to.equal(true);
        expect(utils.validateConfig(config.d).valid).to.equal(true);
    });

    it('sould reject invalid config', function () {

        var config = {
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

        expect(utils.validateConfig(config.a).errors.length).equal(4);
        expect(utils.validateConfig(config.b).errors.length).equal(1);
        expect(utils.validateConfig(config.c).errors.length).equal(1);

    });

    it('should merge a valid configuration with default configuration', function () {

        var config = {
            default: {
                replace: false,
                services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
                timeout: 500,
                getIP: 'sequential'
            },
            a: {},
            b: {
                services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
                timeout: 1000,
                getIP: 'parallel'
            },
            c: {
                replace: true,
                services: ['http://ifconfig.co/x-real-ip']
            }
        };

        var merged = utils.mergeConfig(config.a, config.default);
        expect(merged).to.have.property('timeout', 500);
        expect(merged).to.have.property('services').with.lengthOf(2);
        expect(merged).to.have.property('getIP', 'sequential');

        merged = utils.mergeConfig(config.b, config.default);
        expect(merged).to.have.property('timeout', 1000);
        expect(merged).to.have.property('services').with.lengthOf(4);
        expect(merged).to.have.property('getIP', 'parallel');

        merged = utils.mergeConfig(config.c, config.default );
        expect(merged).to.have.property('timeout', 500);
        expect(merged).to.have.property('services').with.lengthOf(1);


    });

});