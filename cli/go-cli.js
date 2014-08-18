#!/usr/bin/env nodejs
'use strict';

//Dependencies
var getIP = require('../index')();
var getOpt = require('node-getopt');

//Main function
var ipPrint = function(err,ip) {
    if (err)
    	console.log("Failed");
 	else
    	console.log(ip);
};

//Vars
var args = process.argv.length;
var argv = process.argv;

// if(args <= 2){
// 	getIP(ipPrint);
// }else{
// 	console.log("not yet! :( ");
// }

for(var ar in argv){
	switch(argv[ar]){
		case 's'
	}

}