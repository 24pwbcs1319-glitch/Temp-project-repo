/**
 * Middleware function that verifies user session via a simple User ID header.
 * Attaches the user payload to the request object.
 */
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token || token === 'null' || token === 'undefined') {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  // Without JWT, we'll just treat the "token" as the raw user ID
  req.user = { id: token };
  next();
};
