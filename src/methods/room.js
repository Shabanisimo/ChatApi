const { Room, User, Message } = require('../database/connection');

function getUserRooms(token) {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {token: token}
        })
            .then(user => {
                user.getRooms({
                    attributes: ['id', 'name', 'imgUrl', 'token'],
                    include: [
                        {model: User},
                        {
                            model: Message, 
                            order: [ [ 'createdAt', 'DESC' ]], 
                            attributes: ['messageText', 'date', 'id', 'createdAt'],
                            include: [
                                {
                                    model: User, 
                                    as: 'Sender', 
                                    attributes:['name', 'imgUrl', 'token']
                                }
                            ]
                        },
                    ],  
                })
                    .then(data => {
                        resolve(data);
                    })
            })
            .catch(err => {
                reject(err);
            });
    })
};

function getUserRoomsTest(token) {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {token: token},
            include: {model: Room, attributes: ['id']}
        })
            .then(data => {
                resolve(data);
            })
    })
        .catch(err => {
            reject(err);
        });
}

function getList() {
    return new Promise((resolve, reject) => {
        Room.findAll()
            .then(data => resolve(data))
            .catch(err => reject(err));
    })
}

module.exports = { getUserRooms, getList, getUserRoomsTest };