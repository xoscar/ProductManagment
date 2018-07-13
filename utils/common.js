// dependencies
const bcrypt = require('bcrypt-nodejs');

module.exports.encryptString = string => (
  new Promise((resolve, reject) => (
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(string, salt, null, (hashErr, hash) => (
        hashErr ? reject(err) : resolve(hash)
      ));
    })
  ))
);

module.exports.compareToEncryptedString = (encrypted, rawString) => (
  new Promise((resolve, reject) => (
    bcrypt.compare(rawString, encrypted, (err, isMatch) => (
      err ? reject(err) : resolve(isMatch)
    ))
  ))
);

module.exports.validateObjectKeys = (requiredFields, object) => (
  requiredFields.reduce((acc, requiredField) => (
    (!object[requiredField] && acc.concat([{
      code: 'MissingField',
      description: `Missing field: ${requiredField}`,
    }])) || acc
  ), [])
);
