#!/usr/bin/env nodejs
'use strict';

//Dependencies
var extIP = require('../index');
var GetOpt = require('node-getopt');

//CLI parser Object
var getOpt = new GetOpt([
	['h',	'help'			,	'display this help'],
	['r',	'replace'		,	'set to replace services with -s insted of adding'],
	['s',	'services=ARG+'	,	'add service, one per -s (if not set uses default list)'],
	['t',	'timeout=ARG'	,	'set timeout per request (default 500ms)'],
	['P',	'parallel'		,	'set to parallel mode (default sequential)']
])
.bindHelp()
.setHelp(
	"\nThis program prints the external IP of the machine.\n"+
	"Usage: go-cli [OPTION] or [OPTION] <arguement>.\n\n"+
	"If without options, runs with default configuration.\n\n"+
	"[[OPTIONS]]"+
	"\n\n Git: https://github.com/J-Chaniotis/external-ip"
)
.parseSystem();

//Vars
var parallelFlag = false;
var replaceFlag = false;
var services = null;
var timeout = 500;

var config = {};

//Set values from parser
if(getOpt.options.parallel)
	parallelFlag = true;	
if(getOpt.options.replace)
	replaceFlag = true;
if(getOpt.options.services){
	services = getOpt.options.services+"";
	services = services.split(',');
	services.toString();
}if(getOpt.options.timeout)
	timeout = getOpt.options.timeout;

//Fill the config
if(Object.keys(getOpt.options).length!=0){
	config.timeout = timeout;
	config.getIP = 'sequential';
}

//Adjust config
if(parallelFlag==true)
	config.getIP = 'parallel';
if(services != null)
	config.services = services;


var getIP = extIP(config);

getIP(function (err, ip) {
    if (err) {
        throw err;
    }
    console.log(ip);
});