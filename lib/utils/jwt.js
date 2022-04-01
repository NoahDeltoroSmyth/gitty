const jwt = require('jsonwebtoken');

const signCookie = (user) => {
  return jwt.sign({ ...user }, process.env.JWT_SECRET, {
    expiresIn: '1 day',
  });
};

const verify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signCookie,
  verify,
};
