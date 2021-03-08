const express = require('express');
const { getBeforeAppeal, getWhenAppeal } = require('../controllers/guidance-pages');

const router = express.Router();

router.get('/before-you-appeal', getBeforeAppeal);
router.get('/when-you-can-appeal', getWhenAppeal);

module.exports = router;
