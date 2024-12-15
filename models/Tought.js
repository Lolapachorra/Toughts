const {DataTypes} = require('sequelize')

const db = require('../db/conn')
const user = require('./User.js')

const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
})

Tought.belongsTo(user)
user.hasMany(Tought)
module.exports = Tought