export const extractToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      req.token = token;
    }
    next();
  } catch (error) {
    next(error);
  }
}; 