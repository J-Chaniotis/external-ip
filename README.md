#external-ip

[![Build Status](https://travis-ci.org/J-Chaniotis/external-ip.svg?branch=master)](https://travis-ci.org/J-Chaniotis/external-ip)

![XKCD 865](http://imgs.xkcd.com/comics/nanobots.png)



Get your external IP, with fallbacks



##Installation

`npm install external-ip`

##Test
Change your working directory to the project's root, `npm install` to get the development dependencies and then run `npm test`

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
    replace: true, // true: replace the default services list, false: extend it, default: false
    services: ['http://ifconfig.co/x-real-ip', 'http://ifconfig.me/ip'],
    timeout: 600 // set timeout per request, default: 500ms
});

getIP(function (err, ip) {
    if (err) {
        throw err;
    }
    console.log(ip);
});

```

##Why?
No idea, really. Just another lib that gives you your external ip address

##Todo:
* clean up some mess
* sequential / parallel (spam) requests ? 