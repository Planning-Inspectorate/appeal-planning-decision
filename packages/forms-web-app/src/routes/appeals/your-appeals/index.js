const express = require('express');

const router = express.Router();

const decidedAppealsRouter = require('./decided-appeals');
const yourAppealsController = require('../../../controllers/appeals/your-appeals');

router.get('/', yourAppealsController.get);
router.use(decidedAppealsRouter);

module.exports = router;
