const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("thougts", "root", process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (err) {
  console.error("Unable to connect to the database:", err);
}

module.exports = sequelize;
