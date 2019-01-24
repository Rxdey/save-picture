// const Op = Sequelize.Op;
const Sequelize = require('sequelize');

const saveUser = sequelize => {
  return sequelize.define(
    'user',
    {
      // allowNull defaultValue type autoIncrement primaryKey unique
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      user_name: {
        type: Sequelize.STRING(32),
      },
      pass_word: {
        type: Sequelize.STRING(64),
      },
      is_enable: {
        type: Sequelize.TINYINT,
      },
      create_date: {
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'save_user',
    },
  );
};

module.exports = saveUser;
