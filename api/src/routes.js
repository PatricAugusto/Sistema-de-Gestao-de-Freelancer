const express = require('express');
const CustomersController = require('./controllers/CustomersController');

const routes = express.Router();

routes.post('/customers', CustomersController.create);
routes.get('/customers', CustomersController.index);

module.exports = routes;