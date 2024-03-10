import jwt from 'jsonwebtoken';

export const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
      },
      (err, token) => {
        err
          ? (console.log(err), reject('Failed to generate token'))
          : resolve(token);
      }
    );
  });
};
