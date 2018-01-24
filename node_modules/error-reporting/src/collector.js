'use strict';

var util = require('util');
var moment = require('moment');
var mailer = require('./mailer');
var errors = [];
var shouldSendMail = true;
var alwaysSendMail = false;

module.exports.init = function (interval, sendEmails)
{
    shouldSendMail = sendEmails;

    this.report('Service restarted');

    if (!sendEmails) return;

    sendEmail();

    if (interval === 0 || interval === null) {
        alwaysSendMail = true;
        return;
    }

    setInterval(sendEmail, interval * 1000);
};

/**
 * @param {String} text
 * @param {Object} additionalData
 * @param {String} stack
 * @param {Boolean} immediate - if true flushes error queue immediately
 */
module.exports.report = function (text, additionalData, stack, immediate)
{
    var time = moment().format();

    if (shouldSendMail) {
        errors.push({
            time: time,
            text: text,
            err: JSON.stringify(additionalData, undefined, 2),
            stack: stack
        });

        if (immediate === true || alwaysSendMail) {
            sendEmail();
        }
    } else {
        console.error(util.format('%s - %s', time, text));

        if (additionalData) console.error(additionalData);
        if (stack) console.error(stack);

        console.error('='.repeat(80));
    }
};

function sendEmail()
{
    if (errors.length === 0) {
        return;
    }

    var errorList = errors.concat();
    errors = [];

    mailer.sendTemplate({
        time: moment().format(),
        count: errorList.length,
        errors: errorList
    });
}
