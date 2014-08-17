'use strict';

/*globals it, describe*/

// Integration test
var getIP = require('../index')();
var utils = require('../lib/utils');
var should = require('should');

describe('index.js test', function () {
    it('Should return an IP', function (done) {
        this.timeout(3000);
        getIP(function (err, ip) {
            (err === null).should.be.true;
            utils.isIP(ip).should.be.true;
            done();
        });
    });
});