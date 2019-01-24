// const Sequelize = require('sequelize');
const sequelize = require('../db/db.js');
const saveUser = require('./save_user.js')(sequelize);
const moment = require('moment');

// liveUser.hasMany(liveFriend,{foreignKey:'user_id'})
// liveFriend.belongsTo(liveUser)

const findUser = username => {
  return saveUser.count({ where: { user_name: username} })
};
const insertUser = (username,password) => {
  return sequelize.query(`insert into save_user (user_name, pass_word, create_date) VALUES ('${username}','${password}','${moment().format()}')`,{
    raw:false,
    type: "insert"
  })
};
const insertImage = (userId, imgSrc, from_path) => {
  return sequelize.query(`insert into save_image (userId, imgSrc, from_path, create_date) VALUES (${userId},'${imgSrc}','${from_path}','${moment().format()}')`,{
    raw:false,
    type: "insert"
  })
};

const findPassword = (username,password) => {
  return saveUser.findOne({ where: { user_name: username, pass_word: password } })
};

module.exports = {
  findUser,
  insertUser,
  findPassword,
  insertImage
};
