// const Op = Sequelize.Op;
const Sequelize = require('sequelize');

const liveFriend = sequelize => {
  return sequelize.define(
    'live_friend',
    {
      // allowNull defaultValue type autoIncrement primaryKey unique
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      friend_id: {
        type: Sequelize.INTEGER,
      },
      group: {
        type: Sequelize.STRING(64),
      },
      create_date: {
        type: Sequelize.DATE,
      },

    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'live_friend',
    },
  );
};

module.exports = liveFriend;
