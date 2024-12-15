const Tought = require("../models/Tought.js");
const User = require("../models/User.js");
const { Op } = require("sequelize");
module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]],
    });
    console.log(toughtsData);
    const toughts = toughtsData.map((result) => result.get({ plain: true }));
    //showing how much data was encountered when searched
    let toughtsQty = toughts.length;
    console.log(toughtsQty);
    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    try {
      res.render("toughts/home", { toughts, search, toughtsQty });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  static async dashboard(req, res) {
    const userId = req.session.userId;
    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      plain: true,
    });
    if (!user) {
      req.flash(
        "message",
        "Você precisa estar logado para acessar a Dashboard!"
      );
      res.redirect("/login");
      return;
    }
    const toughts = user.Toughts.map((result) => result.dataValues);

    const justuser = user.dataValues.name;
    console.log(toughts);
    let emptyToughts = false;
    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts, emptyToughts, justuser });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }
  static async createToughtPost(req, res) {
    const title = req.body.title;

    const tought = {
      title,
      UserId: req.session.userId,
    };
    //verifying user
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      req.flash(
        "message",
        "Você precisa estar logado para cadastrar uma Tought!"
      );
      res.redirect("/login");
      return;
    }

    console.log(tought);
    try {
      await Tought.create(tought);
      req.flash("message", "Tought criado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.error(err.message);
      req.flash(
        "message",
        "Ocorreu um erro ao tentar cadastrar a Tought, tente novamente!"
      );
      res.render("toughts/create");
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userId;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });
      req.flash("message", "Tought removida com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.error(error.message);
      req.flash(
        "message",
        "Ocorreu um erro ao tentar remover a Tought, tente novamente!"
      );
      res.redirect("/toughts/dashboard");
    }
  }
  static async updateTought(req, res) {
    const id = req.params.id;
    const tought = await Tought.findOne({ where: { id: id }, raw: true });
    res.render("toughts/edit", { tought });
  }
  static async updateToughtPost(req, res) {
    const { title, id } = req.body;
    const tought = {
      title,
    };
    try {
      await Tought.update(tought, { where: { id: id } });
      req.flash("message", "Tought atualizado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.error(error.message);
      req.flash(
        "message",
        "Ocorreu um erro ao tentar atualizar a Tought, tente novamente!"
      );
      res.redirect(`/toughts/edit/${id}`);
    }
  }

  //addLike controller
  static async addLike(req, res) {
    const id = req.params.id;
    const userSession = req.session.userId;
    const tought = await Tought.findOne({ where: { id: id } });
    if(!userSession){
       req.flash('message', 'Você precisa estar logado para curtir uma Tought!');
    return res.redirect('/login');
    }
    console.log()
    console.log(tought.id)
    try{
      tought.likes = (tought.likes || 0) + 1;
       await tought.save();
       req.flash('message', "curtiu com sucesso!")
       res.redirect(`/`,)
      }
    catch(err){
      req.flash('message', "ocorreu um erro")
      console.error("OCORREU UM ERRO",err.message)
    }

   
};
}