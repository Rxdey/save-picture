const Sequelize = require('sequelize');
// const sequelize = new Sequelize('mysql://root:root@127.0.0.1:3306/myblog');
const sequelize = new Sequelize('saveImage', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  operatorsAliases: false,
  timezone: '+08:00',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:');
  });
