var mongoose = require('mongoose');

var User = new mongoose.Schema({
  company: {type: String, lowercase: true},
  domain: {type: String, lowercase: true},
  auth_id: {type: String, unique: true, required: true},
  box_id: {type: String, unique: true, required: true},
  name: {type: String, unique: true, required: false},
  job_title: {type: String, unique: true, required: false},
  location: {type: String, unique: true, required: false},
  bio: {type: String, unique: true, required: false},
  phone_number: {type: String, unique: true, required: false},
  availability: {type: String, unique: true, required: false}
});

mongoose.model('User', User);
