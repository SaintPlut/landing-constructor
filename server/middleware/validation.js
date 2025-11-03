const Joi = require('joi');

const validation = {
  // Валидация входа
  login: {
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().min(6).required()
    })
  },

  // Валидация шаблона
  template: {
    body: Joi.object({
      name: Joi.string().min(1).max(100).required(),
      description: Joi.string().min(1).required(),
      author: Joi.string().min(1).max(100).required(),
      license: Joi.string().min(1).max(50).required(),
      price: Joi.number().min(0).precision(2).required(),
      keywords: Joi.array().items(Joi.string()),
      thumbnail: Joi.string().uri().required(),
      editableBlocks: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('text', 'image').required(),
        label: Joi.string().required(),
        defaultValue: Joi.string().allow(''),
        required: Joi.boolean()
      }))
    })
  },

  // Валидация лендинга
  landing: {
    body: Joi.object({
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().allow(''),
      templateId: Joi.number().integer().positive().required(),
      content: Joi.object().required(),
      isPublished: Joi.boolean(),
      urlSlug: Joi.string().regex(/^[a-z0-9-]+$/).max(100)
    })
  },

  // Валидация параметров запроса
  query: {
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().allow(''),
      sortBy: Joi.string(),
      sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
    })
  }
};

module.exports = validation;