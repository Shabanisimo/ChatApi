const router = require('express').Router();

const { Message, Room, User } = require('../database/connection');

module.exports = router;

router.post('/load', (req, res) => {
    Room.findByPk(req.body.id)
        .then(room => {
            room.getMessages({
                include: [{model: User, as: 'Sender', attributes:['name', 'surname', 'imgUrl', 'token', 'email']}],
                order: [
                    ['id', 'ASC']
                ]
            })
                .then(data => res.send(data));
        });
})
