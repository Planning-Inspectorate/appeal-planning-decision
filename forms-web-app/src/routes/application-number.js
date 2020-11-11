const express = require('express');

const applicationNumberController = require('../controllers/application-number');

const router = express.Router();

router.get('/', applicationNumberController.getApplicationNumber);
router.post('/', applicationNumberController.postApplicationNumber);

module.exports = router;
