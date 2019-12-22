const socket = require('socket.io');
const getDate = require('../functions/functions');
const clientsConnectionList = require('../clientsConnectonList/clientsConnectionList');
const { getUserRoomsToConnection } = require('../methods/room');
const logger = require('../logger/logger');

const { User, Message } = require('../database/connection');

module.exports = class Socket {
  constructor(server) {
    this.io = socket(server);
  }

  startConnection() {
    this.io.on('connection', (socket) => {
      socket.on('conn', (data) => {
        getUserRoomsToConnection(data.token)
          .then((data) => {
            data.dataValues.Rooms.map((room) => {
              socket.join(room.dataValues.id);
            });
          });
        clientsConnectionList.addConnection(socket, data.token);
      });

      socket.on('message.send', (data) => {
        if (data.msg.trim() !== '') {
          User.findOne({
            where: { token: data.userToken },
          })
            .then((user) => {
              Message.create({
                messageText: data.msg,
                SenderId: user.id,
                RoomId: data.roomId,
                date: getDate(),
              })
                .then((message) => {
                  let msg = message.dataValues;
                  const Sender = {
                    name: user.name,
                    surname: user.surname,
                    imgUrl: user.imgUrl,
                    token: user.token,
                  };
                  msg = { ...msg, Sender };
                  this.io.sockets.in(data.roomId).emit('message.sent', msg);
                });
            });
        }
      });

      socket.on('disconnect', () => {
        clientsConnectionList.removeConnection(socket);
        logger('User disconected');
      });
    });

    this.io.on('error', (err) => {
      logger(`Something wrong: ${err}`);
    });
  }
};
