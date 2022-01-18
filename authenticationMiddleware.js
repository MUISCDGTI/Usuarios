function authenticateTokenMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, usr) => {
    if (err) return res.sendStatus(403);
    req.user = usr;
    next();
  });
}

module.exports = authenticateTokenMiddleware;