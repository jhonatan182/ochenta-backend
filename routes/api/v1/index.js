const express = require('express');
const router = express.Router();

const categoriesRoutes = require('./categorias');
const rutasUsuarios = require('./usuarios')

router.use('/categories', categoriesRoutes);
router.use('/usuarios', rutasUsuarios);
router.use('/gastos', rutasUsuarios);

module.exports = router;
