const clientsConnectionList = {
    socketsStore: [],

    addConnection(socket, userId) {
      const clientConnection = {
          userId,
          socket
      };
      console.log(clientConnection);
      console.log(this.socketsStore.map(sock => sock.userId === clientConnection.userId).length);
      if (this.socketsStore.map(sock => sock.userId === clientConnection.userId).length === 0) {
        this.socketsStore.push(clientConnection);
      }
      console.log(this.socketsStore)
    },
  
    removeConnection(socket) {
      if (this.socketsStore.map(sock => sock.socket === socket).length === 0) {
        this.socketsStore = this.socketsStore.filter(s => socket !== s.socket);
        console.log(this.socketsStore)
      }
    },
}

module.exports = clientsConnectionList;