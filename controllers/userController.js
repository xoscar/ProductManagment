// models
const User = require('../models/User');

// libs
const token = require('../utils/token');

module.exports = {
  register: (req, res) => (
    // step #1: validate requestbody
    User.validateBody(req.body)

      // step #2: create user from valid body
      .then(validBody => (
        User.create(validBody)
      ))

      // step #3: send user info to client
      .then(user => (
        res.status(201).json(user.toJSON())
      ))

      // error handler
      .catch(err => (
        res.status(400).json(err)
      ))
  ),

  login: (req, res) => (
    // step #1: validate body and match user.
    User.login(req.body)

      // step #2: create JWT
      .then(user => (
        token.create(Object.assign(user.getTokenInfo(), { create_at: Date.now() }))

          .then(jwtToken => (
            res.json(Object.assign(user.toJSON(), { token: jwtToken }))
          ))
      ))

      // error handler
      .catch(err => (
        res.status(400).json(err)
      ))
  ),

  profile: (req, res) => (
    res.json(req.user.toJSON())
  ),
};
