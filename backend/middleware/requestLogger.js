const requestLogger = (req, res, next) => {
  const userId = req.headers['user-id'] || 'no-user';
  console.log(`[${req.method}] ${req.path} - User: ${userId}`);
  next();
};

module.exports = requestLogger; 