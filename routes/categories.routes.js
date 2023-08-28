const Router = require('express').Router();
const { findAllWithChildren, getcategorybyId } = require('../controllers/categories.controller');

Router.get('/', findAllWithChildren);

Router.get('/get-category-id/:categorieId', getcategorybyId);

module.exports = Router;