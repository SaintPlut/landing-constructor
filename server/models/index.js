const sequelize = require('../config/database');
const User = require('./User');
const Template = require('./Template');
const Landing = require('./Landing');

// Определение связей
User.hasMany(Landing, { foreignKey: 'userId' });
Landing.belongsTo(User, { foreignKey: 'userId' });

Template.hasMany(Landing, { foreignKey: 'templateId' });
Landing.belongsTo(Template, { foreignKey: 'templateId' });

module.exports = {
  sequelize,
  User,
  Template,
  Landing
};