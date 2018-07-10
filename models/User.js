// dependencies
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  avatar: String,

  user_type: {
    type: String,
    enum: ['administrator', 'customer'],
  },

  created_at: Date,
  updated_at: Date,
});

module.exports = mongoose.model('users', userSchema);
