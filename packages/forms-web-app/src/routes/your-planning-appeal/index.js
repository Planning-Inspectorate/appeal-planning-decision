const express = require('express');

const yourPlanningAppealController = require('../../controllers/your-planning-appeal');

const router = express.Router();

router.get('/:appealId', yourPlanningAppealController.getYourPlanningAppeal);

module.exports = router;
