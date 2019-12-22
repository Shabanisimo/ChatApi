const logger = require('../logger/logger');

const clientsConnectionList = {
  socketsStore: [],

  addConnection(socket, userId) {
    const clientConnection = {
      userId,
      socket,
    };
    this.socketsStore.push(clientConnection);
    logger(this.socketsStore);
  },

  removeConnection(socket) {
    this.socketsStore = this.socketsStore.filter((s) => socket !== s.socket);
    logger(this.socketsStore);
  },
};

module.exports = clientsConnectionList;
