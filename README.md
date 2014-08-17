#external-ip

[![Build Status](https://travis-ci.org/J-Chaniotis/external-ip.svg?branch=master)](https://travis-ci.org/J-Chaniotis/external-ip)

![XKCD 865](http://imgs.xkcd.com/comics/nanobots.png)



Get your external IP, with fallbacks



##Installation

`npm install external-ip`

##Test
Change your working directory to the project's root, `npm install` to get the development dependencies and then run `npm test`

##Usage


```javascript
var getIP = require('external-ip')();

getIP(function (err, ip) {
    if (err) {
        //Every service in the list failed to return an ip
    } else {
        //Do stuff        
    }
});

```

##Why?
No idea, really. Just another lib that gives you your external ip address

##Todo:
* Complete tests
* Document
* Clean up some mess
* Use custom urls
* ...??