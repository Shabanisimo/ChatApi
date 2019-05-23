// require modules
const net = require('net');
const func = require('./functions');
const logger = require('./logger/logger');
const env = require('dotenv').config();

// variables
const sockets = [];
let clientId = 0;
const rooms = [];
const regexp = '\/([a-zA-Z]*)';
const commandsList = {
  '/help': (user) => {
    func.helper(user, commandsList);
  },
  '/userList': (user) => {
    func.showUserList(user, sockets);
  },
  '/roomsList': (user) => {
    func.showRooms(user, rooms);
  },
  '/createRoom': (user, roomName) => {
    func.createRoom(user, roomName, rooms);
  },
  '/inviteToRoom': (user, roomName, inviteUser) => {
    if (roomName && inviteUser) {
      func.inviteToRoom(user, roomName, inviteUser, rooms);
    } else {
      (
        user.write('Что-то не так с данными при добавлении челивка в чат.' + '\n')
      );
    }
  },
  '/enterRoom': (user, roomName) => {
    roomName.toString().trim();
    const correctlyRoom = rooms
      .find(r => r[roomName]);
    if (correctlyRoom) {
      const userInRoom = correctlyRoom[roomName]
        .map(obj => obj.nickName === user.nickName);
      if (userInRoom) {
        func.enterRoom(user, roomName);
      } else {
        user.write('Извини, но тебя нет в списке.\n');
      }
    } else {
      user.write('Извини, но такой комноты нет.\n');
    }
  },
  '/exit': (user) => {
    func.exitFromRoom(user);
  },
};

// output data for user
function broadcast(sender, msg) {
  logger(msg);
  sockets.forEach((socket) => {
    if (socket.nickName === sender.nickName) return;
    if (socket.chat === sender.chat) {
      socket.write(`${msg}\n`);
    }
  });
}

// remove socket from sockets array
function removeClient(client) {
  sockets.splice(sockets.indexOf(client), 1);
}

// subscribes to events
const server = net.createServer((socket) => {
  clientId += 1;
  socket.nickName = `User${clientId}`;
  socket.chat = 'common';
  const clientName = socket.nickName;

  sockets.push(socket);
  socket.write('Ты подключился.\n');

  broadcast(socket, `${clientName} joined this chat.`);

  socket.on('data', (data) => {
    if (data.toString()[0] === '/') {
      const newData = data.toString().match(regexp);
      const command = commandsList[newData[0]];
      if (command !== undefined) {
        const param = data.toString().split(' ')[1];
        const param2 = data.toString().split(' ')[2];
        socket.write('--------------------------\n');
        command(socket, param, param2);
      } else {
        func.helper(socket, commandsList);
      }
    } else {
      const msg = `${func.getDate()} : ${clientName} > ${data}`;
      broadcast(socket, msg);
    }
  });

  socket.on('end', () => {
    const msg = `${clientName} left this chat.`;

    removeClient(clientName);

    broadcast(socket, msg);
    if (sockets.length === 0) {
      server.close();
    }
  });
});

server.on('error', (err) => {
  logger(`Something wrong: ${err}`);
});

server.listen(env.PORT, () => {
  logger(`Server listen port ${env.PORT}`);
});
