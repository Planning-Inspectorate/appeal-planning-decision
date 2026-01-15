const express = require('express');

const router = express.Router();

const decidedAppealsRouter = require('./decided-appeals');
const withdrawnAppealsRouter = require('./withdrawn-appeals');
const yourAppealsController = require('../../../controllers/appeals/your-appeals');
const yourAppealsContinueController = require('../../../controllers/appeals/continue');

router.get('/', yourAppealsController.get);
router.get('/continue/:appealId', yourAppealsContinueController.get);
router.use(decidedAppealsRouter);
router.use(withdrawnAppealsRouter);

module.exports = router;
