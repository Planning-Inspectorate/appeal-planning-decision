const express = require('express');
const { getBeforeAppeal } = require('../controllers/guidance-pages');

const router = express.Router();

router.get('/before-you-appeal', getBeforeAppeal);

module.exports = router;
