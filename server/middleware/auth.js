const jwt = require('jsonwebtoken');

const auth = {
  // Middleware для проверки JWT токена
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Токен доступа отсутствует' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Недействительный токен' });
      }
      req.user = user;
      next();
    });
  },

  // Middleware для проверки прав администратора
  requireAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Требуются права администратора' });
    }
    next();
  }
};

module.exports = auth;