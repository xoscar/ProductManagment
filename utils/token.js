// dependencies
const JWT = require('jsonwebtoken');

// models
const User = require('../models/User');

const validate = token => (
  new Promise((resolve, reject) => (
    JWT.verify(token, 'nodejs-training', (err, jwtPayload) => (
      err ? reject(err) : resolve(jwtPayload)
    ))
  ))
);

const validateToken = (token) => {
  if (!token) {
    return Promise.reject({
      statusCode: 401,
      error: [{
        code: 'NotAuthorized',
        description: 'Token not found',
      }],
    });
  }

  // token ${string}
  return validate(token.split(' ')[1]);
};

module.exports = {
  create: body => (
    new Promise((resolve, reject) => (
      JWT.sign(body, 'nodejs-training', { algorithm: 'HS256' }, (err, token) => {
        console.log(err);
        return err ? reject(err) : resolve(token);
      })
    ))
  ),
  middleware: (req, res, next) => (
    // step #1: validate token
    validateToken(req.headers.authorization)

      .then((jwtPayload) => {
        // step #2: add json payload to request
        req.jwtPayload = jwtPayload;

        // step #3: validate if json has an email
        if (jwtPayload.email) {
          // step #4: validate inner token and email
          return User.validateToken(jwtPayload)

            .then((user) => {
              // step #5: add user to request and trigger next function
              req.user = user;
              next();
            });
        }

        return Promise.reject({
          statusCode: 401,
          error: [{
            code: 'NotAuthorized',
            description: 'Invalid token',
          }],
        });
      })

      .catch(err => (
        res.status(err.statusCode).json(err)
      ))
  ),
};
