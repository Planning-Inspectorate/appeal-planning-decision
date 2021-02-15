const express = require('express');
const appealsController = require('../controllers/appeals');
const {
  appealInsertValidationRules,
  appealUpdateValidationRules,
} = require('../validators/appeals/appeals.validator');

const router = express.Router();

router.get('/:id', appealsController.getAppeal);

router.post('/', appealsController.createAppeal);

router.put('/:id', appealInsertValidationRules, appealsController.replaceAppeal);

router.patch('/:id', appealUpdateValidationRules, appealsController.updateAppeal);

module.exports = router;
