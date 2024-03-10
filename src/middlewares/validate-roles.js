import { request, response } from 'express';

export const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Trying to verify a role without validating the token first',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service requires one of the following authorized roles ${roles}`,
      });
    }

    next();
  };
};
