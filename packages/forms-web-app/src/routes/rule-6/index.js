const express = require('express');
const router = express.Router();
const requireRule6User = require('../../middleware//rule-6/require-user');

// const selectedAppealController = require('../../controllers/selected-appeal');
// const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
// const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');

// login
router.use(require('./email-address'));
router.use(require('./enter-code'));
router.use(require('./need-new-code'));
router.use(require('./request-new-code'));
router.use(require('./code-expired'));

router.use(require('./your-appeals'));
router.use(require('./decided-appeals'));

router.get('/', (req, res) => res.redirect('/rule-6/your-appeals'));

router.use(requireRule6User);

router.use(require('./selected-appeal'));
router.use(require('./proof-evidence'));
router.use(require('./appeal-statement'));

// router.get('/:appealNumber', selectedAppealController.get());
// router.get('/:appealNumber/appeal-details', appealDetailsController.get());
// router.get('/:appealNumber/questionnaire', questionnaireDetailsController.get());

module.exports = router;
