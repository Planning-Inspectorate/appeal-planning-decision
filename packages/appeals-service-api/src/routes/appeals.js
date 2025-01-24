const express = require('express');
const ApiError = require('#errors/apiError');
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
	try {
		const body = await getAppeal(req.params.id);
		res.status(200).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

router.post('/', createAppeal);

router.put('/:id', appealInsertValidationRules, async (req, res) => {
	try {
		const body = await updateAppeal(req.params.id, req.body);
		res.status(200).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

router.patch('/:id', appealUpdateValidationRules, async (req, res) => {
	try {
		const body = await updateAppeal(req.params.id, req.body);
		res.status(200).send(body);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		await deleteAppeal(req.params.id);
		res.status(200).send({});
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}
		return res.status(error.code).send(error.errors);
	}
});

module.exports = router;
