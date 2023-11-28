const express = require('express');

const { updateAppeal, getAppeal, createAppeal } = require('../services/appeal.service');
const {
	appealInsertValidationRules,
	appealUpdateValidationRules
} = require('../validators/appeals/appeals.validator');

const router = express.Router();

/**
 * @openapi
 * /api/v1/appeals/{id}:
 *   get:
 *     description: get a single appeal submission by ID
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: appeal submission ID
 *     responses:
 *       200:
 *         description: Returns the appeal submission
 *         schema:
 *           $ref: '#/components/schemas/AppealSubmission'
 *       404:
 *         description: Appeal not found
 *         schema:
 *           $ref: '#/components/schemas/ErrorBody'
 */
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

/**
 * @openapi
 * /api/v1/appeals:
 *   post:
 *     description: create a new appeal submission
 *     responses:
 *       201:
 *         description: Returns the appeal submission
 *         schema:
 *           $ref: '#/components/schemas/AppealSubmission'
 *       500:
 *         description: Something went wrong
 */
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
