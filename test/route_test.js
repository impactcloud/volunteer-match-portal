'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../app.js'); // Our app
var baseURL;
 
describe('Volunteer Application Routes Tests', function() {  
  this.timeout(5000); // How long to wait for a response (ms)
 
  beforeEach(function() {
    // Anything related to set up for tests go here. 
    // e.g. initialize SDK or client objects
    // For additional reading: https://mochajs.org/#hooks

    baseURL = 'http://localhost:3000';
  });
 
  after(function() {
    // This is a great place to clear out results from previously ran tests
    // or if anything needs to reset per run 
    // For additional reading: https://mochajs.org/#hooks
  });
 
  // GET - Valid path for /home
  it('should return successfully GET home route', function() {
    return chai.request(baseURL)
      .get('/home')
      .then(function(res) {
        expect('Content-Type', /json/)
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
 
  // GET - Valid path for /volunteer-list
  it('should return successfully GET volunter_list route', function() {
    return chai.request(baseURL)
      .get('/volunteer-list')
      .then(function(res) {
        expect('Content-Type', /json/)
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });

  // GET - Valid path for /volunteer-form
  it('should return successfully GET volunter-form route', function() {
    return chai.request(baseURL)
      .get('/volunteer-form')
      .then(function(res) {
        expect('Content-Type', /json/)
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });

  // GET - Valid path for /volunteer-dashboard
  it('should return successfully GET volunter-dashboard route', function() {
    return chai.request(baseURL)
      .get('/volunteer-dashboard')
      .then(function(res) {
        expect('Content-Type', /json/)
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
});