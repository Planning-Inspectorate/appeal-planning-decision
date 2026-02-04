const express = require('express');
const router = express.Router();

router.use(require('./code-expired'));
router.use(require('./enter-code'));
router.use(require('./email-address'));
router.use(require('./need-new-code'));
router.use(require('./request-new-code'));

module.exports = router;
