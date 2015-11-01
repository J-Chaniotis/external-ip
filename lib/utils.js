'use strict';

var revalidator = require('revalidator');

var validateConfig = function (config) {
  return revalidator.validate(config, {
    properties: {
      replace: {
        description: 'true: replaces the default services, false: extends them',
        type: 'boolean',
        allowEmpty: false,
        dependencies: 'services'
      },
      services: {
        description: 'array of urls that return the ip in the document body',
        type: 'array',
        minItems: 1,
        allowEmpty: false,
        format: 'url'
      },
      timeout: {
        description: 'timeout per request',
        type: 'integer',
        allowEmpty: false
      },
      getIP: {
        description: 'sequential or parallel ip fetching',
        type: 'string',
        allowEmpty: false,
        enum:['parallel', 'sequential']
      }
    }
  });
};


var mergeConfig = function (extCfg, defCfg) {
  return {
      // Kill it with fire!
      services: extCfg.replace ? extCfg.services : extCfg.services && defCfg.services.concat(extCfg.services) || defCfg.services,
      timeout: extCfg.timeout || defCfg.timeout,
      getIP: extCfg.getIP || defCfg.getIP
  };
};



module.exports = {
  validateConfig: validateConfig,
  mergeConfig: mergeConfig
};