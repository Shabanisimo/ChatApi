module.exports = function logger(msg, user) {
  console.log(msg);
  user.emit('msg', {text: msg, type: 0})
};
