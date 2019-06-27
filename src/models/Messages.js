module.exports = (sequelize, Sequelize) => {
    return sequelize.define("Message", {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: Sequelize.STRING(35),
            allowNull: false,
        },
        messageText: Sequelize.TEXT,
    })
}