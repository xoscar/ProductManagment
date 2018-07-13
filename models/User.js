// dependencies
const mongoose = require('mongoose');
const uuid = require('uuid-v4');

// libs
const { encryptString, compareToEncryptedString, validateObjectKeys } = require('../utils/common');

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
}, {
  toJSON: {
    transform: (doc, { email, user_type: userType, name, avatar }) => ({
      email,
      user_type: userType,
      name,
      avatar,
    }),
  },
});

/**
 * Instance functions
 */
userSchema.methods.getTokenInfo = function getTokenInfo() {
  const { token, email, user_type: userType } = this;
  return {
    token,
    email,
    user_type: userType,
  };
};

/**
 * Static functions
 */
userSchema.statics.validateBody = function validateBody(requestBody) {
  const errors = validateObjectKeys('name email password user_type'.split(' '), requestBody);

  if (requestBody.password.length <= 6) {
    errors.push({
      code: 'InvalidPassword',
      description: 'Password must be at least 6 characters',
    });
  }

  // validacion del email, cofirm passsword

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

userSchema.statics.login = function login(requestBody) {
  const errors = validateObjectKeys('email password'.split(' '), requestBody);

  return errors.length ? Promise.reject({
    error: errors,
  }) :

    this.findOne({ email: requestBody.email })

      .then(user => (
        user ? (
          compareToEncryptedString(user.password, requestBody.password)

            .then(isMatch => (
              isMatch ? Promise.resolve(user) : Promise.reject({
                error: [{
                  code: 'EmailOrPasswordMissmatch',
                  description: 'email or password doesn\'t match',
                }],
              })
            ))
        ) : Promise.reject({
          error: [{
            code: 'EmailOrPasswordMissmatch',
            description: 'email or password doesn\'t match',
          }],
        })
      ));
};

userSchema.statics.validateToken = function validateToken(jwtPayload) {
  // step #1: find user
  return this.findOne({ email: jwtPayload.email })

    .then(user => (
      // step #2: validate if user exists
      user && user.token === jwtPayload.token ? Promise.resolve(user) : Promise.reject({
        statusCode: 401,
        error: [{
          code: 'NotAuthorized',
          description: 'Invalid token',
        }],
      })
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
