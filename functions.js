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
  let room = Object.keys(rooms).indexOf(msg);
  if (room < 0) {
    if (msg) {
      msg.toString().trim();
  
      const newRoom = {};
      newRoom[msg] = [];
      newRoom[msg].push(user);
      rooms.push(newRoom);
  
      user.send(`Вы создали чат: ${msg}\n`);
    } else {
      user.send('Ты забыл написать название чата.' + '\n');
    }
  } else {
    user.send('Такая комната есть.')
  }
}

function inviteToRoom(user, roomName, inviteUser, rooms) {
  roomName.toString().trim();
  let room = rooms.filter(r => Object.keys(r).indexOf(roomName) >= 0);
  let iUser = room[0][roomName].filter(u => u.nickName === inviteUser.nickName);
  if (iUser.length === 0) {
    rooms.forEach(room => (Object.keys(room)[0] === roomName
      ? room[roomName].push(inviteUser)
      : user.send('Такого чата нет.' + '\n')));
  
    user.send(`Вы пригласили ${inviteUser.nickName} в чат ${roomName}\n`);
  } else {
    user.send(`Пользователь ${inviteUser.nickName} уже добавлен.\n`)
  }
}

function showRooms(user, list) {
  list.map(room => user.send(`${Object.keys(room)}\n`));
}

function exitFromRoom(user) {
  if (user.chat !== 'common') {
    user.chat = 'common';
  } else {
    user.send('Извини, но ты и так в общем чате.');
  }
}

function enterRoom(user, roomName) {
  if (user.chat !== roomName) {
    user.chat = roomName;
  } else {
    user.send('Что ты делаешь? Ты и так в этом чате.');
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
