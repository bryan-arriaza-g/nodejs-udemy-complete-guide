const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete-guide', 'root', 'root', {
  dialect: 'mysql',
  host: '172.17.0.2',
});

module.exports = sequelize;
