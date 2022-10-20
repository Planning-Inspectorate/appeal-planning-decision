const express = require('express');

const { updateAppeal, getAppeal, createAppeal } = require('../controllers/appeals');
const {
	appealInsertValidationRules,
	appealUpdateValidationRules
} = require('../validators/appeals/appeals.validator');

const router = express.Router();

router.get('/:id', getAppeal);

router.post('/', createAppeal);

router.put('/:id', appealInsertValidationRules, updateAppeal);

router.patch('/:id', appealUpdateValidationRules, updateAppeal);

module.exports = router;
