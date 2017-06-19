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
        let getIP = extIP();
        getIP(function (err, ip) {
            expect(err).to.equal(null);
            expect(utils.isIP(ip)).to.equal(true);
            done();
        });
    });

    it('Should return an IP with custom configuration', function (done) {
        this.timeout(timeout);

        let getIP = extIP({
            replace: true, // true: replace the default services list, false: extend it, default: false
            services: ['http://ident.me/', 'http://icanhazip.com/'],
            timeout: timeout, // set timeout per request, default: 500ms,
            getIP: 'parallel'
        });

        getIP(function (err, ip) {
            expect(err).to.equal(null);
            expect(utils.isIP(ip)).to.equal(true);
            done();
        });
    });
});