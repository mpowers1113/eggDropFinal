const jwt = require('jsonwebtoken'); // eslint-disable-line
const ClientError = require('./client-error'); // eslint-disable-line

function authorizationMiddleware(req, res, next) {
  const { token } = req;
  if (!token) throw new ClientError('authentication required');
  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authorizationMiddleware;
