// dependencies
const mongoose = require('mongoose');
const uuid = require('uuid-v4');

// libs
const { encryptString } = require('../utils/common');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  avatar: String,

  user_type: {
    type: String,
    enum: ['administrator', 'customer'],
    default: 'customer',
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Static functions
 */
userSchema.statics.validateBody = function validateBody(requestBody) {
  const requiredFields = 'name email password user_type'.split(' ');

  const errors = requiredFields.reduce((acc, requiredField) => (
    (!requestBody[requiredField] && acc.concat([{
      code: 'MissingField',
      description: `Missing field: ${requiredField}`,
    }])) || acc
  ), []);

  if (requestBody.password.length <= 6) {
    errors.push({
      code: 'InvalidPassword',
      description: 'Password must be at least 6 characters',
    });
  }

  return errors.length ? Promise.reject({
    error: errors,
  }) :

    this.findOne({ email: requestBody.email })

      .then(user => (
        user ? Promise.reject({
          error: [{
            code: 'UserAlreadyExists',
            description: 'Email is already registered',
          }],
        }) : Promise.resolve(requestBody)
      ));
};

/**
 * Hooks
 */
userSchema.pre('save', function preSave(next) {
  // generar token
  // encriptar la contraseña
  // modificar el updated_at
  if (this.isNew) {
    return Promise.all([
      encryptString(this.password),
      encryptString(uuid()),
    ])

      .then(([password, token]) => {
        this.token = token;
        this.password = password;
        next();
      });
  }

  this.updated_at = Date.now();
  return next();
});

module.exports = mongoose.model('users', userSchema);
