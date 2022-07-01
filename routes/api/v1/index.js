const express = require('express');
const router = express.Router();

const categoriesRoutes = require('./categorias');
const rutasUsuarios = require('./usuarios');
const cashflowRoutes = require('./cashflow');
const securityRoutes = require('./security');

//middlware
const { authorizer } = require('./middlewares/authorizer');
const { jwtAuthorizer } = require('./middlewares/jwtAuthorizer');

//router.use('/categories', categoriesRoutes);
router.use('/categories', authorizer, jwtAuthorizer, categoriesRoutes);
router.use('/usuarios', rutasUsuarios);
router.use('/gastos', rutasUsuarios);
router.use('/cashflow', authorizer, jwtAuthorizer, cashflowRoutes);

router.use('/auth', authorizer, securityRoutes);
module.exports = router;
