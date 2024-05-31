const express = require('express');

const {
	updateAppeal,
	getAppeal,
	createAppeal,
	deleteAppeal
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

router.delete('/:id', async (req, res) => {
	let statusCode = 200;
	let body = {};
	try {
		await deleteAppeal(req.params.id);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;
