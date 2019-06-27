const socket = require('socket.io');

class Socket {
    constructor(server) {

        this.sockets = [];
        this.clientId = 0;

        this.io = socket(server);

        this.connection();
    }

    broadcast(sender, msg) {
        sockets.forEach((socket) => {
          if (socket.chat === sender.chat) {
            socket.emit('msg', msg);
          }
        });
    }

    connection() {
        this.io.on('connection', (socket) => {
            let msg;
            clientId += 1;
            socket.nickName = `User${clientId}`;
            socket.chat = 'common';
            const clientName = socket.nickName;
            console.log(socket.id);
          
            sockets.push(socket);
          
            msg = {text: `${clientName} joined this chat.`, type: 0};
            broadcast(socket, msg);
          
            socket.on('message', (data) => {
              console.log(data);
              if (data.toString()[0] === '/') {
                const newData = data.toString().match(regexp);
                const command = commandsList[newData[0]];
                if (command !== undefined) {
                  const param = data.toString().split(' ')[1];
                  const param2 = data.toString().split(' ')[2];
                  command(socket, param, param2);
                } else {
                  func.helper(socket, commandsList);
                }
              } else {
                msg = {
                  sender: socket.nickName,
                  text: data.toString(),
                  date: func.getDate(),
                  type: 1
                }
                broadcast(socket, msg);
              }
            });
          
            socket.on('disconnect', () => {
              let msg = {text: `${clientName} left this chat.`, type: 0};
              
              removeClient(clientName);
          
              broadcast(socket, msg);
            });
        });

        io.on('error', (err) => {
            logger(`Something wrong: ${err}`);
          });
    }
}

module.exports = Socket;