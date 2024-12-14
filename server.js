const express = require("express");
require('dotenv').config()
const { engine } = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const cors = require('cors')
const port = 3000;
//cors

const conn = require("./db/conn");
const app = express();

//Models
const Tought = require("./models/Tought.js");
const User = require("./models/User.js");
//rotas import
const toughtsRoutes = require("./routes/ToughtRouters.js");
const authRoutes = require("./routes/AuthRoutes.js");
//import controller
const ToughtController = require("./controllers/ToughtController.js");
//configurando view
app.engine(
  "handlebars",
  engine({
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    defaultLayout: "main",
    // Path to partials directory
  })
);
app.set("view engine", "handlebars");
//receber resposta do body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//session middleware
app.use(
  session({
    name: "session",
    secret: "meusegredo",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "session"),
    }),
    cookie: {
      maxAge: 600000,
      secure: false,
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    },
  })
);

//flash messages middleware
app.use(flash());

//public path
app.use(express.static("public"));
//salvar a sessao na resposta
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }

  next();
});

//routes
app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);
app.get("/", ToughtController.showToughts);

conn
  .sync()
  //.sync({ force: true })
  .then(() => {
    console.log("Database connected");
    app.listen(port);
    
  })
  .catch((err) => console.log("Error connecting to database", err.message));
