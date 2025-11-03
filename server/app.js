const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const sequelize = require('./config/database');
const swaggerSpec = require('./docs/swagger');
const errorHandler = require('./middleware/errorHandler');

// Импорт роутов
const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Обработка ошибок валидации celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use(errorHandler);

// Инициализация базы данных и запуск сервера
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL подключена успешно');

    // Синхронизация моделей с базой данных
    await sequelize.sync({ alter: true });
    console.log('✅ Модели синхронизированы');

    // Создание администратора по умолчанию
    const { User } = require('./models');
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@landingbuilder.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Администратор по умолчанию создан');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📚 Документация API: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;