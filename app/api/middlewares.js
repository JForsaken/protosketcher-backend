import jwt from 'jsonwebtoken';

export default null;

/*
 * Applies security to route, will now require an access token
 */
export const requiresToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const request = req;
  const response = {
    success: false,
    message: 'No token provided',
  };

  // decode token
  if (token) {
    // verifies secret and checks token
    jwt.verify(token, process.env.DB_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      }

      // if everything is good, save to request for use in other routes
      request.decodedToken = decoded._doc;
      next();

      return null;
    });
  } else {
    return res.status(403).json(response);
  }

  return null;
};
