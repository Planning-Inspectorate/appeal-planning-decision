const express = require('express');

const { updateAppeal, getAppeal, createAppeal } = require('../services/appeal.service');
const {
	appealInsertValidationRules,
	appealUpdateValidationRules
} = require('../validators/appeals/appeals.validator');

const router = express.Router();

router.get(
	'/:id',
	/*
		#swagger.path = '/appeals/{id}'
		#swagger.summary = 'Returns an existing appeal'
		#swagger.description = 'The appeal includes the state of all subsections'
		#swagger.parameters['id'] = {
			in: 'path',
			required: true,
			description: 'Unique identifier',
			example: '2a22725ced0a40da92e82ae919bfcd2a',
		}		
		#swagger.responses[200] = {
			description: 'Returns an appeal'
		}
		#swagger.responses[404] = {
			description: 'The appeal could not be found'
		}
	*/
	async (req, res) => {
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
	}
);

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
