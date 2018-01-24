'use strict';

var collector = require('./src/collector');
var mailer = require('./src/mailer');

/**
 * @param {Object} config
 */
module.exports.init = function (config)
{
    config = mergeConf(config || {});

    mailer.init(config);
    collector.init(config.interval, config.transporter !== null);
};

/**
 * @param {String}  [text]
 * @param {Object}  [additionalData]
 * @param {String}  [stack]
 * @param {Boolean} [immediate] - if true flushes error queue immediately
 */
module.exports.report = function (text, additionalData, stack, immediate)
{
    collector.report(text, additionalData, stack, immediate);
};

function mergeConf(config)
{
    var defaults = {
        transporter: null,
        from: null,
        to: null,
        cc: null,
        subject: 'Errors',
        interval: 30
    };

    var conf = JSON.parse(JSON.stringify(defaults));

    for (var key in conf) {
        if (!conf.hasOwnProperty(key)) continue;

        conf[key] = config[key];
    }

    return config;
}
