const express = require('express');
const { getBeforeAppeal, getWhenAppeal, getAfterAppeal } = require('../controllers/guidance-pages');

const router = express.Router();

router.get('/before-you-appeal', getBeforeAppeal);
router.get('/when-you-can-appeal', getWhenAppeal);
router.get('/after-you-appeal', getAfterAppeal);

module.exports = router;
