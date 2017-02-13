/* eslint consistent-return: "off", no-else-return: "off" */

import jwt from 'jsonwebtoken';

import Admission from './admissions/model';

export default null;

/*
 * Applies security to route, will now require an access token
 */
export const requiresToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const request = req;

  // decode token
  if (token) {
    // verifies secret and checks token
    jwt.verify(token, process.env.DB_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      } else {
        request.decodedToken = decoded._doc;

        Admission.findOne({ userId: request.decodedToken._id })
          .then((admission) => {
            if (!admission) {
              return res.status(403).json({
                success: false,
                message: 'Cannot find the user for this token',
              });
            } else if (admission.token !== token) {
              return res.status(403).json({
                success: false,
                message: 'This token does not represent the last authentication for this user',
              });
            } else {
              // If the token is sent, is valid, and matches the last authentication
              next();
            }
          })
          .catch(() => res.status(500).json({
            success: false,
            message: 'Failed to find the user for this token',
          }));
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token provided',
    });
  }
};
