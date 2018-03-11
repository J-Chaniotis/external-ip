'use strict';

/*globals it, describe*/

// Integration test
const extIP = require('../index');
const utils = require('../lib/utils');
const expect = require('chai').expect;

const timeout = 3000;


describe('index.js test', function () {
    it('Should return an IP with default configuration', function (done) {
        this.timeout(timeout);
        const getIP = extIP();
        getIP((err, ip) => {
            expect(err).to.equal(null);
            expect(utils.isIP(ip)).to.equal(true);
            done();
        });
    });

    it('Should return an IP with custom configuration', function (done) {
        this.timeout(timeout);

        const getIP = extIP({
            replace: true, // true: replace the default services list, false: extend it, default: false
            services: ['http://ident.me/', 'http://icanhazip.com/'],
            timeout: timeout, // set timeout per request, default: 500ms,
            getIP: 'parallel'
        });

        getIP((err, ip) => {
            expect(err).to.equal(null);
            expect(utils.isIP(ip)).to.equal(true);
            done();
        });
    });

    it('Should throw an error if configuration is invalid', function (done) {
        try {
            extIP({
                replace: 'Batman',
                services: ['Robin'],
                timeout: 'Freeze'
            });
        } catch (error) {
            expect(error).to.be.instanceof(Error);
            done();
        }
    });
});