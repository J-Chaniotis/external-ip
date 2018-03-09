# external-ip 
[![Build Status](https://travis-ci.org/J-Chaniotis/external-ip.svg?branch=master)](https://travis-ci.org/J-Chaniotis/external-ip) 
[![Dependency Status](https://david-dm.org/j-Chaniotis/external-ip.svg)](https://david-dm.org/j-Chaniotis/external-ip)
[![npm version](https://badge.fury.io/js/external-ip.svg)](https://badge.fury.io/js/external-ip)

![XKCD 865](http://imgs.xkcd.com/comics/nanobots.png)

`external-ip` is a node.js library to get your external ip from multiple services. 

## Installation

`npm install external-ip`

## Usage

basic

```javascript
'use strict';

const getIP = require('external-ip')();

getIP((err, ip) => {
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

const extIP = require('external-ip');

let getIP = extIP({
    replace: true,
    services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.io/ip'],
    timeout: 600,
    getIP: 'parallel',
    userAgent: 'Chrome 15.0.874 / Mac OS X 10.8.1'
});

getIP((err, ip) => {
    if (err) {
        throw err;
    }
    console.log(ip);
});

```
### Promises
The API of this library is designed around the classic node.js error-first callback. 
As of node.js V8, converting this type of callback into a promise is pretty straight forward and
requires one more line of code.

basic
```javascript
'use strict';

const {promisify} = require('util'); //<-- Require promisify
const getIP = promisify(require('external-ip')()); // <-- And then wrap the library

getIP().then((ip)=> {
    console.log(ip);
}).catch((error) => {
    console.error(error);
});

```
with configuration

```javascript
'use strict';
const { promisify } = require('util'); //<-- Require promisify
const getIP = promisify(require('external-ip')({
    replace: true,
    services: ['http://icanhazip.com/', 'http://ident.me/'],
    timeout: 600,
    getIP: 'parallel',
    verbose: true
})); // <-- And then wrap the library

getIP().then((ip) => {
    console.log(ip);
}).catch((error) => {
    console.error(error);
});
```
If you believe this extra step shouldn be there, feel free to open an issue and/or a pull request

## Configuration

### extIP([config])

`require('external-ip')` returns a constructor function that accepts an optional configuration object.
 It can be used to create multiple instances with different configuration if necessary

* **services:** `Array` of urls that return the ip in the html body, required if replace is set to true
* **replace:** `Boolean` if true, replaces the internal array of services with the user defined, if false, extends it, default: `false` 
* **timeout:** Timeout per request in ms, default `1000`
* **getIP:** `'sequential'` Makes a request to the first url in the list, if that fails sends to the next and so on. `'parallel'` Makes requests to all the sites in the list, on the first valid response all the pending requests are canceled, default: `'sequential'`
* **userAgent:** `String` Set a custom `User-Agent` header, default: `curl/`
* **verbose:** `Boolean` Log additional information to the console, default: `false`

Returns the configured getIP instance.

### getIP(callback)
The callback gets 2 arguments:
1. error: if every service in the list fails to return a valid ip
2. ip: your external ip

## CLI
install as a global package with `npm install -g external-ip`.
```
$ external-ip -h

Usage: external-ip [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -R, --replace                 replace internal services instead of extending them.
    -s, --services <url>          service url, see examples, required if using -R
    -t, --timeout <ms>            set timeout per request
    -P, --parallel                set to parallel mode
    -u, --userAgent <User-Agent>  provide a User-Agent header, default: curl/
    -v, --verbose                 provide additional details


        This program prints the external IP of the machine.
        All arguments are optional.

        Examples:
        $ external-ip
        $ external-ip -P -t 1500 -R -s http://icanhazip.com/ -s http://ident.me/

        Default services:
        http://icanhazip.com/
        http://ident.me/
        http://tnx.nl/ip
        http://myip.dnsomatic.com/
        http://ipecho.net/plain
        http://diagnostic.opendns.com/myip

        Documentation can be found at https://github.com/J-Chaniotis/external-ip
```
## Test
Change your working directory to the project's root, `npm install` to get the development dependencies and then run `npm test`

## Links
* [moira](https://www.npmjs.org/package/moira)
* [externalip](https://www.npmjs.org/package/externalip)
* [extip](https://www.npmjs.org/package/extip)
