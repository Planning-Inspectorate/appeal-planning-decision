const express = require('express');
const router = express.Router();

router.use(require('./enter-code'));
router.use(require('./lpa-dashboard'));

module.exports = router;
