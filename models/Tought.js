const { DataTypes } = require("sequelize");

const db = require("../db/conn");
const user = require("./User.js");

const Tought = db.define("Tought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
    validate: {
      len: {
        args: [1, 72], // Define o limite entre 1 e 72 caracteres
        msg: "O Pensamento deve ter entre 1 e 72 caracteres.",
      },
    },
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Tought.belongsTo(user);
user.hasMany(Tought);
module.exports = Tought;
