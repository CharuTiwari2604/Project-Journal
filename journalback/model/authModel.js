const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // bio: String,
  // location: String,
  // phone: String,
  // Add other fields if needed
},
{ timestamps: true } 
);

module.exports = mongoose.model('User', userSchema);
