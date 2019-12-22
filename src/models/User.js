module.exports = (sequelize, Sequelize) => sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  surname: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  password: Sequelize.TEXT,
  token: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  imgUrl: Sequelize.TEXT,
});
