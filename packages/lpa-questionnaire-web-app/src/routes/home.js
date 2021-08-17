const express = require('express');
const indexController = require('../controllers');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

/* GET home page. */
router.get('/appeal-questionnaire/:id((?!(upload|delete)\\w+))', authenticate, indexController.getIndex);

module.exports = router;
