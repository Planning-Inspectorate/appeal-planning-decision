const express = require('express');

const router = express.Router();

const decidedAppealsRouter = require('./decided-appeals');
const yourAppealsController = require('../../../controllers/appeals/your-appeals');
const yourAppealsContinueController = require('../../../controllers/appeals/continue');
const selectedAppealRouter = require('./selected-appeal');

router.get('/', yourAppealsController.get);
router.get('/continue/:appealId', yourAppealsContinueController.get);
router.use(decidedAppealsRouter);

module.exports = router;
