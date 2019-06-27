// require modules
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const getDate = require('./functions/functions');

const {User, Room, Message} = require('./database/connection');

const port = 3030;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socket(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const logger = require('./logger/logger');


// variables
const sockets = [];
let clientId = 0;

// output data for user
function broadcast(sender, msg) {
  sockets.forEach((socket) => {
    if (socket.chat === sender.chat) {
      socket.emit('msg', msg);
    }
  });
}

// subscribes to events
io.on('connection', (socket) => {
  socket.on('conn', (data) => {
    socket.userId = data.token;
  });

  socket.on('changeRoom', (data) => {
    socket.join(data.id, () => {
      console.log(socket.rooms);
    });
  })

  socket.on('message.send', (data) => {
    User.findOne({
      where: {token: data.userToken}
    })
      .then(user => {
        Message.create({
          messageText: data.msg,
          SenderId: user.id,
          RoomId: data.roomId,
          date: getDate(),
        })
          .then(message => {
            let msg = message.dataValues;
            const Sender = {
              name: user.name,
              surname: user.surname,
              imgUrl: user.imgUrl,
              token: user.token,
              email: user.email
            }
            msg = {...msg, Sender};
            io.sockets.in(data.roomId).emit('message.sent', msg);
          })
      })
  });

  socket.on('disconnect', () => {    
    console.log('User disconected')
  });
});

io.on('error', (err) => {
  logger(`Something wrong: ${err}`);
});

app.use('/api/user', require('./routes/user'));
app.use('/api/room', require('./routes/room'));
app.use('/api/message', require('./routes/message'));

server.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`)
});


// {
//   SenderId: user.id,
//   RoomId: data.roomId,
//   messageText: data.msg,
//   date: getDate(),
// }