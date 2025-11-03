const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
  // Вход в систему
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Поиск пользователя
      const user = await User.findOne({ 
        where: { username, isActive: true } 
      });

      if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }

      // Проверка пароля
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }

      // Генерация токена
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Вход выполнен успешно',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Получение текущего пользователя
  getMe: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};

module.exports = authController;