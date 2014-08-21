#external-ip [![Build Status](https://travis-ci.org/J-Chaniotis/external-ip.svg?branch=master)](https://travis-ci.org/J-Chaniotis/external-ip) ![Dependencies](https://david-dm.org/J-chaniotis/external-ip.svg)

![XKCD 865](http://imgs.xkcd.com/comics/nanobots.png)



`external-ip` is a node.js library to get your external ip from multiple services. 



##Installation

`npm install external-ip`

##Usage

basic

```javascript
'use strict';

var getIP = require('external-ip')();

getIP(function (err, ip) {
    if (err) {
        // every service in the list has failed
        throw err;
    }
    console.log(ip);
});

```

with configuration

```javascript
'use strict';

var extIP = require('external-ip');

var getIP = extIP({
    replace: true,
    services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.me/ip'],
    timeout: 600,
    getIP: 'parallel'
});

getIP(function (err, ip) {
    if (err) {
        throw err;
    }
    console.log(ip);
});

```
##extIP([config])
external-ip exposes a constructor function that accepts a configuration object with the following optional properties:
* **services:** `Array` of urls that return the ip in the document body, required if replace is set to true
* **replace:** `Boolean` if true, replaces the internal array of services with the user defined, if false, extends it, default: `false` 
* **timeout:** Timeout per request in ms, default `500`
* **getIP:** `'sequential'` Sends a request to the first url in the list, if that fails sends to the next and so on. `'parallel'` Sends requests to all the sites in the list, on the first valid response all the pending requests are canceled. default: `'sequential'`

Returns the configured getIP function.

##getIP(callback)
The callback gets 2 arguments:
1. error: if every service in the list fails to return a valid ip
2. ip: your external ip

##Test
Change your working directory to the project's root, `npm install` to get the development dependencies and then run `npm test`

##Todo
 maybe a CLI

##Links
* [moira](https://www.npmjs.org/package/moira)
* [externalip](https://www.npmjs.org/package/externalip)
* [extip](https://www.npmjs.org/package/extip)