'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../app.js'); // Our app
 
describe('Volunteer Application Routes Tests', function() {  
  this.timeout(5000); // How long to wait for a response (ms)
 
  before(function() {
    // Anything related to set up for tests go here. 
    // e.g. initialize SDK or client objects
    // For additional reading: https://mochajs.org/#hooks
  });
 
  after(function() {
    // This is a great place to clear out results from previously ran tests
    // or if anything needs to be cleared per run 
    // For additional reading: https://mochajs.org/#hooks
  });
 
 
  // GET - Valid path for /volunteer_list
  it.only('should return found for volunteer_list route', function() {
    return chai.request('http://localhost:3000')
      .get('/volunteer_list')
      .then(function(res) {
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
 
  // POST - Bad Request
//   it('should return Bad Request', function() {
//     return chai.request(app)
//       .post('/colors')
//       .type('form')
//       .send({
//         color: 'YELLOW'
//       })
//       .then(function(res) {
//         throw new Error('Invalid content type!');
//       })
//       .catch(function(err) {
//         expect(err).to.have.status(400);
//       });
//   });
});