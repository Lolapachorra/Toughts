const express = require('express');

const router = express.Router()

const ToughtController = require('../controllers/ToughtController.js');
const { checkAuth } = require('../helpers.js/auth.js');
//rotas
router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtPost)
router.get('/edit/:id', checkAuth, ToughtController.updateTought)
router.post('/edit/', checkAuth, ToughtController.updateToughtPost)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.post('/remove', checkAuth, ToughtController.removeTought)
router.get('/', ToughtController.showToughts)
router.post('/addLike/:id', ToughtController.addLike)

module.exports = router