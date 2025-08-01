// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Ім\'я не може бути порожнім'],
    trim: true,
    minlength: [2, 'Ім\'я не може бути менше 2 літер'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetToken: {
    type: String
  },
  resetExpires: {
    type: String
  }
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;