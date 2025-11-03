const { Landing, User, Template } = require('../models');
const { Op } = require('sequelize');

const adminController = {
  // Получение всех лендингов для админ-панели
  getAllLandings: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        userId,
        isPublished
      } = req.query;

      const offset = (page - 1) * limit;

      // Построение условий поиска
      const where = {};
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (userId) {
        where.userId = userId;
      }

      if (isPublished !== undefined) {
        where.isPublished = isPublished === 'true';
      }

      const { count, rows: landings } = await Landing.findAndCountAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          },
          {
            model: Template,
            attributes: ['id', 'name', 'author']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      res.json({
        landings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get admin landings error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Получение статистики для админ-панели
  getDashboardStats: async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalTemplates = await Template.count({ where: { isActive: true } });
      const totalLandings = await Landing.count();
      const publishedLandings = await Landing.count({ where: { isPublished: true } });

      // Последние лендинги
      const recentLandings = await Landing.findAll({
        include: [
          {
            model: User,
            attributes: ['username']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      res.json({
        stats: {
          totalUsers,
          totalTemplates,
          totalLandings,
          publishedLandings
        },
        recentLandings
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Удаление лендинга
  deleteLanding: async (req, res) => {
    try {
      const landing = await Landing.findByPk(req.params.id);

      if (!landing) {
        return res.status(404).json({ error: 'Лендинг не найден' });
      }

      await landing.destroy();
      res.json({ message: 'Лендинг успешно удален' });
    } catch (error) {
      console.error('Delete landing error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};

module.exports = adminController;