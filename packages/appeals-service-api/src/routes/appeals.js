const express = require('express');

const { updateAppeal, getAppeal, createAppeal } = require('../services/appeal.service');
const {
	appealInsertValidationRules,
	appealUpdateValidationRules
} = require('../validators/appeals/appeals.validator');

const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

router.get(
	'/:id',
	asyncHandler(async (req, res) => {
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
	})
);

router.post('/', asyncHandler(createAppeal));

router.put(
	'/:id',
	appealInsertValidationRules,
	asyncHandler(async (req, res) => {
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
	})
);

router.patch(
	'/:id',
	appealUpdateValidationRules,
	asyncHandler(async (req, res) => {
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
	})
);

module.exports = router;
