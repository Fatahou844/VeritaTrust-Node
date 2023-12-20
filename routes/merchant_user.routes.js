const Router = require('express').Router();
const { getUsers, updatemerchantuser } = require('../controllers/merchantUser.controller.js');

Router.get('/', getUsers);
Router.put('/:id', updatemerchantuser);

module.exports = Router;