'use strict';

/*globals describe, it*/

var utils = require('../lib/utils');
var sould = require('should');


describe('utils.js test', function () {

    it('should be able to validate IPv4, IPv6 and hostnames', function () {
        utils.isIP('192.168.1.1').should.be.true;
        utils.isIP('94.65.128.173').should.be.true;
        utils.isIP('FE80:0000:0000:0000:0202:B3FF:FE1E:8329').should.be.true;
        utils.isIP('FE80::0202:B3FF:FE1E:8329').should.be.true;
        utils.isIP('batman.local').should.be.true;


        utils.isIP(111111).should.be.false;
        utils.isIP('192..1.1').should.be.false;
        utils.isIP('94.65.128.1A3').should.be.false;
        utils.isIP('FE80:0000:0000:0000:0202:B3FF:FE1E:').should.be.false;
    });


    it('should loop i times and pass the arguments to done callback', function(cb) {
        var i = 10;
        utils.asyncLoop({
            iterations: i,
            exec: function (i, stop, next) {
                next(i, 'man');
            },
            done: function (result, bat) {
                result.should.equal(i-1);
                bat.should.equal('man');
                cb();
            }
        });

    });


    it('should loop i times and stop at n and pass the arguments to done callback', function(cb) {
        var i = 10;
        var n = 4;
        utils.asyncLoop({
            iterations: i,
            exec: function (i, stop, next) {
                if(i === n) {
                    stop(i, 'tab');
                }
                next(i, 'man');
            },
            done: function (result, bat) {
                result.should.equal(n);
                bat.should.equal('tab');
                cb();
            }
        });

    });

});