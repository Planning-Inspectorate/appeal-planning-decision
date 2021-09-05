const { Router } = require('express');
const reply = require('./reply');

const routes = Router();

routes.use('/api/v1/reply', reply);



module.exports = routes;
