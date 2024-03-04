const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
      (err, token) => {
        err
          ? (console.log(err), reject('Failed to generate token'))
          : resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
