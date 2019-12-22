module.exports = (sequelize, Sequelize) => sequelize.define('Room', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.STRING(45),
  imgUrl: Sequelize.TEXT,
  token: Sequelize.TEXT,
});
