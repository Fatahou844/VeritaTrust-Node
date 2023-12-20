const Router = require('express').Router();
const { findAllWithChildren, getcategorybyId, getAdmincategorybyId, getTopcategories } = require('../controllers/categories.controller');

Router.get('/:category_id', findAllWithChildren);

Router.get('/getpopular/topcategories', getTopcategories);

Router.get('/get-category-id/:categorieId', getcategorybyId);

Router.get('/admin/get-category-id/:categorieId', getAdmincategorybyId);

module.exports = Router;