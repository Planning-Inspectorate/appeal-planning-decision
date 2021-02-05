const express = require('express');
const indexController = require('../controllers');

const router = express.Router();

/* GET home page. */
router.get('/:id/', indexController.getIndex);

module.exports = router;
