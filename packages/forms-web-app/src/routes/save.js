const express = require('express');
const saveAndReturnController = require('../controllers/save');

const router = express.Router();

router.post('/', saveAndReturnController.postSaveAndReturn);

module.exports = router;
