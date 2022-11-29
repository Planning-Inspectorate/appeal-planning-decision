const express = require('express');

const { updateAppeal, getAppeal, createAppeal } = require('../services/appeal.service');
const {
	appealInsertValidationRules,
	appealUpdateValidationRules
} = require('../validators/appeals/appeals.validator');

const router = express.Router();

router.get('/:id', async (req, res) => {
	let statusCode = 200;
	let body = '';
	try {
		body = await getAppeal(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.post('/', createAppeal);

router.put('/:id', appealInsertValidationRules, updateAppeal);

router.patch('/:id', appealUpdateValidationRules, updateAppeal);

module.exports = router;
