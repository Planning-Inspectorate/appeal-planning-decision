const express = require('express');
const {
  getBeforeAppeal,
  getWhenAppeal,
  getStagesAppeal,
} = require('../controllers/guidance-pages');

const router = express.Router();

router.get('/before-you-appeal', getBeforeAppeal);
router.get('/when-you-can-appeal', getWhenAppeal);
router.get('/stages-of-an-appeal', getStagesAppeal);

module.exports = router;
