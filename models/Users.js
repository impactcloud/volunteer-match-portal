var mongoose = require('mongoose');

var User = new mongoose.Schema({
  company: {type: String, lowercase: true},
  domain: {type: String, lowercase: true},
  auth_id: {type: String, unique: true, required: true},
  box_id: {type: String, unique: true, required: true}w
});

mongoose.model('User', User);
