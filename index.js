// require modules
const express = require('express');
const http = require('http');
const socket = require('socket.io');

const port = 3020;

const app = express();
const server = http.createServer(app);
const io = socket(server);

const func = require('./functions');
const logger = require('./logger/logger');


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
    inviteUser = func.returnUser(inviteUser, sockets);
    if (roomName && inviteUser) {
      func.inviteToRoom(user, roomName, inviteUser, rooms);
    } else {
      user.send('Что-то не так с данными при добавлении челивка в чат.' + '\n');
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
        user.send('Извини, но тебя нет в списке.\n');
      }
    } else {
      user.send('Извини, но такой комноты нет.\n');
    }
  },
  '/exit': (user) => {
    func.exitFromRoom(user);
  },
};

// output data for user
function broadcast(sender, msg) {
  sockets.forEach((socket) => {
    if (socket.chat === sender.chat) {
      socket.emit('msg', msg);
    }
  });
}

// remove socket from sockets array
function removeClient(client) {
  sockets.splice(sockets.indexOf(client), 1);
}

// subscribes to events
io.on('connection', (socket) => {
  let msg;
  clientId += 1;
  socket.nickName = `User${clientId}`;
  socket.chat = 'common';
  const clientName = socket.nickName;

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
    if (sockets.length === 0) {
      server.close();
    }
  });
});

io.on('error', (err) => {
  logger(`Something wrong: ${err}`);
});

server.listen(port, () => console.log(`LISTENING ON PORT ${port}`));