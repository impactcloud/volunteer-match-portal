'use strict';

var fs = require('fs');
var handlebars = require('handlebars');

var template = null;
var transporter = null;
var from = null;
var to = null;
var cc = [];
var subject = 'Errors';

/**
 * @param {Object} config
 */
exports.init = function (config)
{
    transporter = config.transporter;

    from = config.from;
    to = config.to;
    cc = config.cc;
    subject = config.subject;

    var path = __filename.replace('/src/mailer.js', '');

    var contents = fs.readFileSync(path + '/templates/error-mail.handlebars', {
        encoding: 'utf8'
    });

    template = handlebars.compile(contents);
};

/**
 * @param {String} html
 */
exports.send = function (html)
{
    var retryCount = 0;
    var options = {
        from: from,
        to: to,
        cc: cc,
        subject: subject,
        html: html
    };

    send(options, responseHandler);

    function send(options, callback)
    {
        transporter.sendMail(options, callback)
    }

    function responseHandler(err)
    {
        if (!err) return;

        if (retryCount < 5) {
            retryCount++;

            setTimeout(function () {
                send(options, responseHandler);
            }, 500);
        } else {
            throw err;
        }
    }
};

/**
 * @param {Object} params
 */
exports.sendTemplate = function (params)
{
    exports.send(createHtml(params));
};

function createHtml(variables)
{
    return template(variables);
}
