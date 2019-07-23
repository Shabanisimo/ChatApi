const router = require('express').Router();

const { Message, Room, User } = require('../database/connection');

module.exports = router;

router.post('/load', (req, res) => {
    Room.findByPk(req.body.id)
        .then(room => {
            room.getMessages({
                include: [{model: User, as: 'Sender', attributes:['name', 'imgUrl', 'token']}],
                order: [
                    ['id', 'ASC']
                ],
                attributes: ['createdAt', 'id', 'messageText', 'SenderId'],
            })
                .then(data => res.send(data));
        });
})
