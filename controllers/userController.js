const User = require('../models/User');

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
};
