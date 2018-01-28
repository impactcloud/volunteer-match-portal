/**
 * @fileoverview Volunteer Match Portal Endpoint Integration Tests
 */
'use strict';

/* eslint-disable no-sync */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var assert = require('chai').assert,
    mockery = require('mockery'),
    sinon = require('sinon'),
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');
// configVars = require('./config.json');

// util function to read in json response stubs from fixtures/endpoints folder
function getFixture(fixture) {
    return fs.readFileSync(path.resolve(__dirname, `fixtures/endpoints/${fixture}.json`));
}

describe('Endpoint', function () {

    // ------------------------------------------------------------------------------
    // Setup
    // ------------------------------------------------------------------------------
    var sandbox = sinon.sandbox.create();

    var TEST_API_ROOT = 'https://api.box.com',
        TEST_UPLOAD_ROOT = 'https://upload.box.com/api',
        TEST_CLIENT_ID = 'client_id',
        TEST_CLIENT_SECRET = 'TOP SECRET',
        TEST_ACCESS_TOKEN = 'HEYOOOO',
        MODULE_FILE_PATH = 'box-node-sdk';

    var apiMock,
        uploadMock,
        BoxSDK,
        sdk,
        basicClient;

    beforeEach(function () {
        apiMock = nock(TEST_API_ROOT);

        apiMock.defaultReplyHeaders({
            Age: 0,
            'Cache-Control': 'no-cache, no-store',
            Connection: 'keep-alive',
            Date: 'Thu, 17 Nov 2016 06:54:58 GMT',
            Server: 'ATS',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        });

        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerAllowable(MODULE_FILE_PATH, true);

        BoxSDK = require(MODULE_FILE_PATH);

        sdk = new BoxSDK({
            clientID: TEST_CLIENT_ID,
            clientSecret: TEST_CLIENT_SECRET
        });

        basicClient = sdk.getBasicClient(TEST_ACCESS_TOKEN);

        // Initialize Twilio SDK and client here
    });

    afterEach(function () {
        sandbox.verifyAndRestore();
        mockery.deregisterAll();
        mockery.disable();
        nock.cleanAll();
    });

    describe.only('BOX GROUP MEMBERSHIP', function () {
        it('should make correct request and return successfully for CREATE group membership', function (done) {

            var groupID = '1560354',
                userID = '13130406',
                options = {
                    role: basicClient.groups.userRoles.MEMBER
                },
                fixture = getFixture('group-memberships/post_create_group_membership_200');

            apiMock.post('/2.0/group_memberships', options)
                .matchHeader('Authorization', function (authHeader) {
                    assert.equal(authHeader, `Bearer ${TEST_ACCESS_TOKEN}`);
                    return true;
                })
                .matchHeader('User-Agent', function (uaHeader) {
                    assert.include(uaHeader, 'Box Node.js SDK v');
                    return true;
                })
                .reply(200, fixture);

            basicClient.groups.addUser(userID, groupID, options, function(){
                assert.isNull(err);
                assert.deepEqual(data, JSON.parse(fixture));

                done();
            });
            done();
        });
    });

    describe.only('BOX GET FOLDER ITEMS', function () {
        it('should make correct request and return successfully for GET folder items', function (done) {

            var folderID = '0',
                options = {
                    fields: 'name, modified_at, size, permissions',
                    offset: 0,
                    limit: 2
                },
                fixture = getFixture('folder-items/get_folder_items_200');

            apiMock.post(`/2.0/folders/${folderID}/items`, options)
                .matchHeader('Authorization', function (authHeader) {
                    assert.equal(authHeader, `Bearer ${TEST_ACCESS_TOKEN}`);
                    return true;
                })
                .matchHeader('User-Agent', function (uaHeader) {
                    assert.include(uaHeader, 'Box Node.js SDK v');
                    return true;
                })
                .reply(200, fixture);

            basicClient.folders.getItems(folderID, options, function(){
                assert.isNull(err);
                assert.deepEqual(data, JSON.parse(fixture));

                done();
            });
            done();
        });
    });
});
