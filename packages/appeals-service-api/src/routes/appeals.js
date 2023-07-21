const express = require('express');

const {
	updateAppeal,
	getAppeal,
	createAppeal,
	getAppealByLPACodeAndId
} = require('../services/appeal.service');
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

router.get('/:lpaCode/:id', async (req, res) => {
	let statusCode = 200;
	const { id, lpaCode } = req.params;
	let body = '';
	try {
		body = await getAppealByLPACodeAndId(lpaCode, id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.post('/', createAppeal);

router.put('/:id', appealInsertValidationRules, async (req, res) => {
	let statusCode = 200;
	let body = '';
	try {
		body = await updateAppeal(req.params.id, req.body);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

router.patch('/:id', appealUpdateValidationRules, async (req, res) => {
	let statusCode = 200;
	let body = '';
	try {
		body = await updateAppeal(req.params.id, req.body);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
