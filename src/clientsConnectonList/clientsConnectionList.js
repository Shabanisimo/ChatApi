const clientsConnectionList = {
    socketsStore: [],

    addConnection(socket, userId) {
      const clientConnection = {
          userId,
          socket
      };
      this.socketsStore.push(clientConnection); 
      console.log(this.socketsStore)
    },
  
    removeConnection(socket) {
      this.socketsStore = this.socketsStore.filter(s => socket !== s.socket);
      console.log(this.socketsStore)
    },
}

module.exports = clientsConnectionList;