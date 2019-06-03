const log = require('./logger/logger');

function getDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

  today = `${mm}/${dd}/${yyyy}`;
  return today;
}

function helper(user, list) {
  Object.keys(list).map(com => user.send(`${com}\n`));
}

function showUserList(user, list) {
  list.map(u => user.send(`${u.nickName}\n`));
}

function createRoom(user, msg, rooms) {
  msg.toString().trim();
  let room = rooms[msg];
  if (!room) {
    if (msg) {
      msg.toString().trim();

      rooms[msg] = [];
      rooms[msg].push(user);

      log(`Вы создали чат: ${msg}`, user); 
    } else {
      log('Ты забыл написать название чата.', user);
    }
  } else {
    log('Такая комната есть.', user)
  }
}

function inviteToRoom(user, roomName, inviteUser, rooms) {
  roomName.toString().trim();
  if (rooms[roomName]) {
    let iUser = rooms[roomName].filter(u => u.nickName === inviteUser.nickName);
    if (iUser.length === 0) {
      rooms[roomName].push(inviteUser);
      log(`Пользователь ${inviteUser.nickName} добавлен.`, user)
    } else {
      log(`Пользователь ${inviteUser.nickName} уже добавлен.`, user)
    }
  } else {
    log(`Такой комнаты не существует.`, user);
  }
}

function showRooms(user, rooms) {
  log(`${Object.keys(rooms)}`, user)
}

function exitFromRoom(user) {
  if (user.chat !== 'common') {
    user.chat = 'common';
  } else {
    log('Извини, но ты и так в общем чате.', user)
  }
}

function enterRoom(user, roomName) {
  if (user.chat !== roomName) {
    user.chat = roomName;
    
  } else {
    log('Что ты делаешь? Ты и так в этом чате.', user)
  }
}

function returnUser(userName, userList) {
  let retUser = userList.filter(user => user.nickName === userName);
  return retUser[0];
}

module.exports = {
  getDate,
  helper,
  showUserList,
  createRoom,
  showRooms,
  inviteToRoom,
  exitFromRoom,
  enterRoom,
  returnUser,
};
