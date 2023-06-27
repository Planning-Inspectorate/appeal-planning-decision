const express = require('express');
const router = express.Router();

router.use(require('./enter-code'));
router.use(require('./lpa-dashboard'));
router.use(require('./request-new-code'));
router.use(require('./need-new-code'));
router.use(require('./code-expired'));
module.exports = router;
