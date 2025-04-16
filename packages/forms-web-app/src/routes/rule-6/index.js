const express = require('express');
const router = express.Router();
const requireRule6User = require('../../middleware/rule-6/require-user');

// login
router.use(require('./email-address'));
router.use(require('./enter-code'));
router.use(require('./need-new-code'));
router.use(require('./request-new-code'));
router.use(require('./code-expired'));

router.use(requireRule6User);

router.get('/', (_, res) => res.redirect('/rule-6/your-appeals'));
router.use(require('./your-appeals'));
router.use(require('./decided-appeals'));
router.use(require('./selected-appeal'));
router.use(require('./proof-evidence'));
router.use(require('./appeal-statement'));

module.exports = router;
