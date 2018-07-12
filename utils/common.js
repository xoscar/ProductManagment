// dependencies
const bcrypt = require('bcrypt-nodejs');

module.exports.encryptString = string => (
  new Promise((resolve, reject) => (
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(string, salt, null, (hashErr, hash) => {
        return hashErr ? reject(err) : resolve(hash);
      });
    })
  ))
);
