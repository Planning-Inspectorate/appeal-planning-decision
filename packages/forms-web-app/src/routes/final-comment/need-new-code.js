const express = require('express');
const needNewCodeController = require('../../controllers/final-comment/need-new-code');

const router = express.Router();

router.get('/need-new-code', needNewCodeController.getNeedNewCode);

module.exports = router;
