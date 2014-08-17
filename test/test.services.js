'use strict';

/*globals describe, it*/

var services = require('../lib/services');
var should = require('should');

var successRequest = {
    get: function (opts, cb) {
        opts.should.have.property('url', 'batman');
        opts.should.have.property('timeout', 500);
        opts.should.have.property('headers').with.property('User-Agent', 'curl/');
        cb(null, null, '94.65.128.173');
    }
};

var failedRequest = {
    get: function (opts, cb) {
        cb('booom', null, null);
    }
};

var invalidRequest = {
    get: function (opts, cb) {
        cb(null, null, 11111);
    }
};



describe('services.js test', function () {

    it('Should have correct request config and return without errors', function () {
        var req = services.requestFactory(successRequest, 'batman');
        req(function (err, ip) {
            (err === null).should.be.true;
            ip.should.equal('94.65.128.173');
        });
    });

    it('Should return with an error', function () {
        var req = services.requestFactory(failedRequest, 'batman');
        req(function (err, ip) {
            err.should.equal('booom');
            (ip === null).should.be.true;
        });
    });

    it('Should validate a correct ip', function () {
        var req = services.requestFactory(successRequest, 'batman');
        req = services.addValidation(req);
        req(function (err, ip) {
            (err === null).should.be.true;
            ip.should.equal('94.65.128.173');
        });
    });

    it('Should return an error with an invalid ip', function () {
        var req = services.requestFactory(invalidRequest, 'batman');
        req = services.addValidation(req);
        req(function (err, ip) {
            err.should.be.an.Error;
            (ip === null).should.be.true;
        });
    });

});