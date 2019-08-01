const router = require('express').Router();
const uuid = require('uuid/v1');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

const { User } = require('../database/connection');
const error = 'Wrong data';


router.post('/signin/google', (req, res) => {
    let user = jwt.decode(req.body.token);
      User.findOrCreate(
        { 
          where: {email: user.email },
          defaults: {
              name: user.given_name,
              surname: user.family_name,
              imgUrl: user.picture,
              email: String(user.email).toLowerCase(),
              token: uuid()
          },
          attributes:['name', 'surname', 'imgUrl', 'email', 'token']
        })
        .then(data => res.send(data))
        .catch(err => console.log('ERROR ' + err));
});

router.post('/getInfo', (req, res) => {
    User.findOne(
      { 
        where: {token: req.body.token },
        attributes:['name', 'surname', 'imgUrl', 'email', 'token', 'id']
      })
      .then(data => res.send(data))
      .catch(err => console.log('ERROR ' + err));
});

router.post('/registration', (req, res) => {
  const regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const user = req.body;
  const emailValid = regExp.test(String(user.email).toLowerCase());
  console.log(req.body)
  User.findOne({
    where: {email: String(user.email).toLowerCase()}
  })
  .then(data => {
    if (data) {
      const error = 'Wrong data';
      res.status(400).send({ error });
    } else {
      if (
        emailValid
        && user.password.length >= 8
        && user.name.length > 0
        && user.surname.length > 0
      ) {
        User.create(
          {
            name: user.name,
            surname: user.surname,
            email: String(user.email).toLowerCase(),
            password: passwordHash.generate(user.password),
            token: uuid()
          },
          {attributes:['name', 'surname', 'imgUrl', 'token', 'email']}
        )
        .then(data => res.send(data))
        .catch(err => console.log('ERROR ' + err));
      }
      else {
        res.status(400).send({ error });
      }
    }
  })
});


router.post('/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    where: {email: String(email).toLowerCase()}
  })
  .then(data => {
    if (data) {
      if (passwordHash.verify(password, data.password)) {
        res.send({
          name: data.name, 
          surname: data.surname,
          email: data.email,
          imgUrl: data.imgUrl,
          token: data.token
        }
      );
      } else {
        res.status(400).send({ error });
      }
    } else {
      res.status(400).send({ error });
    }
  })
})

router.get('/getUserList', (req, res) => {
  User.findAll({
    attributes:['name', 'surname', 'imgUrl', 'token', 'email']
  })
    .then(data => {
      res.send(data);
    })
})

router.put('/updateUserInfo', (req, res) => {
  const {token, name, surname, email} = req.body;
  User.findOne({
    where: {token: token}
  })
    .then(user => {
      user.update({
        name: name,
        surname: surname,
        email: email,
      })
        .then(() => {
          res.send({
            name: name,
            surname: surname,
            email: email,
          })
        })
    })
})

module.exports = router;