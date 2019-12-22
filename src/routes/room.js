const router = require('express').Router();
const uuid = require('uuid/v1');
const clientConnectionLIst = require('../clientsConnectonList/clientsConnectionList');
const { getUserRooms, getList } = require('../methods/room');

const { Room, User } = require('../database/connection');

module.exports = router;

router.post('/createRoom', (req, res) => {
  if (req.body.name !== '' && req.body.users.length > 1) {
    Room.create(
      {
        name: req.body.name,
        token: uuid(),
      },
    )
      .then((room) => {
        req.body.users.forEach((user) => {
          User.findOne(
            {
              where: { token: user },
            },
          )
            .then((u) => {
              console.log(u);
              room.addUsers(u.dataValues.id);
              clientConnectionLIst.socketsStore.forEach((client) => {
                if (u.dataValues.token === client.userId) {
                  client.socket.emit('addRoom', room);
                  client.socket.join(room.id);
                }
              });
            });
        });
      });
  } else {
    const error = 'Не ввели название комнаты.';
    res.send({ error });
  }
});

router.post('/getList', async (req, res) => {
  await getUserRooms(req.body.token)
    .then((data) => {
      res.send(data);
    });
});

router.post('/getRoomInfo', (req, res) => {
  Room.findOne({
    include: {
      model: User,
      attributes: ['name', 'surname', 'imgUrl', 'email', 'token'],
    },
  })
    .then((data) => res.send(data));
});

router.get('/getRoomsList', async (req, res) => {
  await getList()
    .then((data) => res.send(data));
});
