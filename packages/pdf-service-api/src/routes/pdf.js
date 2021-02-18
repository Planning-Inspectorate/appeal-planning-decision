const { Router } = require('express');
const pdfController = require('../controllers/pdf');

const routes = new Router();

routes.post('/', pdfController.generatePdf);

module.exports = routes;
