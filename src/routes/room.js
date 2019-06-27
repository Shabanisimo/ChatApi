const router = require('express').Router();
const uuid = require('uuid/v1');

const { Room, User } = require('../database/connection');

module.exports = router;

router.post('/createRoom', (req, res) => {
    Room.create(
        {
            name: req.body.name,
            token: uuid(),
        }
    )
    .then(room => {
        req.body.users.map(user => {
            User.findOne(
                {
                    where: {token: user }
                }
            )
                .then(u => {
                    room.addUsers(u);
                })
        })
    })
});

router.post('/getList', (req, res) => {
    Room.findAll(
        {
            include: [
                {model: User, where: { token: req.body.token}}
            ]
        }
    )
    .then(data => res.send(data));
});

