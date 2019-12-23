const { Room, User, Message } = require('../database/connection');

function getUserRooms(token) {
  return new Promise((resolve, reject) => {
    User.findOne({
      where: { token },
    })
      .then((user) => {
        user.getRooms({
          attributes: ['id', 'name', 'imgUrl', 'token', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['name', 'surname', 'imgUrl', 'email', 'token', 'id'],
            },
            {
              model: Message,
              attributes: ['messageText', 'date', 'id', 'createdAt', 'SenderId'],
            },
          ],
        })
          .then((data) => {
            resolve(data);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getUserRoomsToConnection(token) {
  return new Promise((resolve, reject) => {
    User.findOne({
      where: { token },
      include: { model: Room, attributes: ['id'] },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getList() {
  return new Promise((resolve, reject) => {
    Room.findAll()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

module.exports = { getUserRooms, getList, getUserRoomsToConnection };
