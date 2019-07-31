// require modules
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Socket = require('./src/socket/socket');

const port = process.env.PORT || 3030;

const app = express();
app.use(cors());
const server = http.createServer(app);

const socket = new Socket(server);
socket.startConnection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/user', require('./src/routes/user'));
app.use('/api/room', require('./src/routes/room'));
app.use('/api/message', require('./src/routes/message'));

server.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`)
});