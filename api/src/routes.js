const express = require('express');
const CustomersController = require('./controllers/CustomersController');
const ProjectsController = require('./controllers/ProjectsController');

const routes = express.Router();

routes.post('/customers', CustomersController.create);
routes.get('/customers', CustomersController.index);

routes.post('/projects', ProjectsController.create);
routes.get('/projects', ProjectsController.index);
routes.patch('/projects/:id/status', ProjectsController.updateStatus);

module.exports = routes;