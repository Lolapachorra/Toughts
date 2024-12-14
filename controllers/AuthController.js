const User = require("../models/User.js");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    //check if user is registered
    const user = await User.findOne({where: {email: email}})

    if (!user) {
      req.flash("message", "Usuário não encontrado!");
      res.render("auth/login");
      return;
    }
    //check if passowrd is correct
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if(!passwordMatch){
      req.flash("message", " senha inválidos!");
      res.render("auth/login");
      return;
    }
    //initialize session
    req.session.userId = user.id;
    req.flash("message", "Login realizado com sucesso!");
    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //validaçoes
    if (password != confirmpassword) {
      req.flash("message", "As senhas não conferem, tente novamente!");
      res.render("auth/register");
      return;
    }
    //check if user is already registered
    const checkifUserExist = await User.findOne({ where: { email: email } });
    if (checkifUserExist) {
      req.flash("message", "Já existe um usuário com esse email, tente outro!");
      res.render("auth/register");
      return;
    }

    //create password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };
    try {
      const createdUser = await User.create(user);

      //initialize session
      req.session.userId = createdUser.id;
      req.flash("message", "Cadastro realizado com sucesso!");
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      req.flash("message", "Ocorreu um erro ao cadastrar, tente novamente!");
      res.render("auth/register");
    }
  }

  static logOut(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
};
