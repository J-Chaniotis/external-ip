'use strict';

/*globals it, describe*/

// Integration test
var extIP = require('../index');
var utils = require('../lib/utils');
var should = require('should');

describe('index.js test', function () {
    it('Should return an IP with default configuration', function (done) {
        this.timeout(3000);
        var getIP = extIP();
        getIP(function (err, ip) {
            (err === null).should.be.true;
            utils.isIP(ip).should.be.true;
            done();
        });
    });

    it('Should return an IP with custom configuration', function (done) {
        this.timeout(3000);

        var getIP = extIP({
            replace: true, // true: replace the default services list, false: extend it, default: false
            services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.me/ip'],
            timeout: 600, // set timeout per request, default: 500ms,
            getIP: 'parallel'
        });

        getIP(function (err, ip) {
            (err === null).should.be.true;
            utils.isIP(ip).should.be.true;
            done();
        });
    });
});