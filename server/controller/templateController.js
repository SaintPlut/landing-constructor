const { Template, Landing } = require('../models');
const { Op } = require('sequelize');

const templateController = {
  // Получение всех шаблонов с пагинацией и фильтрацией
  getAllTemplates: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        sortBy = 'id',
        sortOrder = 'ASC',
        minPrice,
        maxPrice,
        license
      } = req.query;

      const offset = (page - 1) * limit;

      // Построение условий поиска
      const where = { isActive: true };
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { keywords: { [Op.contains]: [search] } }
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice !== undefined) where.price[Op.lte] = parseFloat(maxPrice);
      }

      if (license) {
        where.license = license;
      }

      const { count, rows: templates } = await Template.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      res.json({
        templates,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Получение шаблона по ID
  getTemplateById: async (req, res) => {
    try {
      const template = await Template.findOne({
        where: { id: req.params.id, isActive: true }
      });

      if (!template) {
        return res.status(404).json({ error: 'Шаблон не найден' });
      }

      res.json(template);
    } catch (error) {
      console.error('Get template error:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  // Создание лендинга на основе шаблона
  createLanding: async (req, res) => {
    try {
      const { templateId } = req.params;
      const { title, description, content, isPublished, urlSlug } = req.body;

      // Проверка существования шаблона
      const template = await Template.findOne({
        where: { id: templateId, isActive: true }
      });

      if (!template) {
        return res.status(404).json({ error: 'Шаблон не найден' });
      }

      // Создание лендинга
      const landing = await Landing.create({
        title,
        description,
        templateId,
        userId: req.user.id,
        content,
        isPublished: isPublished || false,
        urlSlug: urlSlug || `landing-${Date.now()}`
      });

      res.status(201).json(landing);
    } catch (error) {
      console.error('Create landing error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'URL slug уже существует' });
      }
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};

module.exports = templateController;