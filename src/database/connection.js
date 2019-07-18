const Sequelize = require('sequelize');
const UserModel = require('../models/User');
const RoomModel = require('../models/Room');
const MessageModel = require('../models/Messages');

const sequelize = new Sequelize('Chat', 'root', '', {host: "127.0.0.1", dialect: "mysql", operatorsAliases: false});

global.sequelize = sequelize;

const UserRoom = sequelize.define('UserRoom', {});

const User = UserModel(sequelize, Sequelize);
const Room = RoomModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);

User.belongsToMany(Room, {through: UserRoom, unique: false});
Room.belongsToMany(User, {through: UserRoom, unique: false});

User.hasMany(Message, {
    foreignKey: {
      name: 'SenderId',
      allowNull: false,
    }
});
Message.belongsTo(User, {
  as: 'Sender',
  foreignKey: 'SenderId'
});
Room.hasMany(Message, {
    foreignKey: {
      name: 'RoomId',
      allowNull: false,
    }
});
Message.belongsTo(Room, {
  as: 'Room',
  foreignKey: 'RoomId'
});

sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  .then(() => sequelize
    .sync({
      force: false,
    }))
  .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
  .then(() => {
    console.log('Database synchronised.');
  }, (err) => {
    console.log(err);
});

module.exports = {
    User,
    Room,
    Message,
    UserRoom
}