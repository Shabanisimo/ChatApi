function getDate() {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();

  today = `${mm}/${dd}/${yyyy}`;
  return today;
}

function helper(user, list) {
  Object.keys(list).map(com => user.write(`${com}\n`));
}

function showUserList(user, list) {
  list.map(u => user.write(`${u.nickName}\n`));
}

function createRoom(user, msg, rooms) {
  if (msg) {
    msg.toString().trim();

    const userInfo = {};
    userInfo.nickName = user.nickName;
    userInfo.type = 'isAdmin';
    userInfo.state = 'live';

    const newRoom = {};
    newRoom[msg] = [];
    newRoom[msg].push(userInfo);
    rooms.push(newRoom);

    user.write(`Вы создали чат: ${msg}\n`);
  } else {
    user.write('Ты забыл написать название чата.' + '\n');
  }
}

function inviteToRoom(user, roomName, inviteUser, rooms) {
  const userInfo = {};
  userInfo.nickName = inviteUser;
  userInfo.type = 'isUser';

  roomName.toString().trim();

  rooms.forEach(room => (Object.keys(room)[0] === roomName
    ? room[roomName].push(inviteUser)
    : user.write('Такого чата нет.' + '\n')));

  user.write(`Вы пригласили ${inviteUser} в чат ${roomName}\n`);
}

function showRooms(user, list) {
  list.map(room => user.write(`${Object.keys(room)}\n`));
}

function exitFromRoom(user) {
  if (user.chat !== 'common') {
    user.chat = 'common';
  } else {
    user.write('Извини, но ты и так в общем чате.');
  }
}

function enterRoom(user, roomName) {
  if (user.chat !== roomName) {
    user.chat = roomName;
  } else {
    user.write('Что ты делаешь? Ты и так в этом чате.');
  }
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
};
