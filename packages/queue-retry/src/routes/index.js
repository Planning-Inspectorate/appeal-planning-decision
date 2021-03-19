const { Router } = require('express');
const queue = require('./queue');

const routes = Router({ mergeParams: true });

routes
  .get('/', (req, res) => {
    res.redirect('/queue');
  })
  .use('/queue', queue);

module.exports = routes;
