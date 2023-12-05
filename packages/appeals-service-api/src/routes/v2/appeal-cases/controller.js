const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { AppealCaseRepository } = require('./repo');

const repo = new AppealCaseRepository();

/**
 * @type {import('express').RequestHandler}
 */
async function getByCaseReference(req, res) {
	const { caseReference } = req.params;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference is required');
	}
	try {
		const appealCase = await repo.getByCaseReference(caseReference);
		if (!appealCase) {
			throw ApiError.withMessage(404, 'not found');
		}
		res.status(200).send(appealCase);
	} catch (err) {
		logger.error({ error: err, caseReference }, 'error fetching case by reference');
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function list(req, res, next) {
	if ('lpa-code' in req.query) {
		listByLpaCode(req, res, next);
		return;
	}
	if ('postcode' in req.query) {
		listByPostcode(req, res, next);
		return;
	}
	throw ApiError.withMessage(400, 'lpa-code || postcode is required');
}

/**
 * @type {import('express').RequestHandler}
 */
async function listByLpaCode(req, res) {
	const { 'lpa-code': lpaCode, 'decided-only': decidedOnly } = req.query;

	if (!lpaCode || typeof lpaCode !== 'string') {
		throw ApiError.withMessage(400, 'lpa-code is required');
	}
	const isDecidedOnly = decidedOnly === 'true';
	try {
		const appealCases = await repo.listByLpaCode({ lpaCode, decidedOnly: isDecidedOnly });
		res.status(200).send(appealCases);
	} catch (err) {
		logger.error({ error: err, lpaCode, decidedOnly }, 'error fetching cases by lpa code');
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function listByPostcode(req, res) {
	const { postcode: postcode, 'decided-only': decidedOnly } = req.query;

	if (!postcode || typeof postcode !== 'string') {
		throw ApiError.withMessage(400, 'postcode is required');
	}
	const isDecidedOnly = decidedOnly === 'true';
	try {
		const appealCases = await repo.listByPostCode({ postcode, decidedOnly: isDecidedOnly });
		res.status(200).send(appealCases);
	} catch (err) {
		logger.error({ error: err, postcode, decidedOnly }, 'error fetching cases by postcode');
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function getCount(req, res, next) {
	if ('lpa-code' in req.query) {
		countByLpaCode(req, res, next);
		return;
	}
	throw ApiError.withMessage(400, 'lpa-code is required');
}

/**
 * @type {import('express').RequestHandler}
 */
async function countByLpaCode(req, res) {
	const { 'lpa-code': lpaCode, 'decided-only': decidedOnly } = req.query;

	if (!lpaCode || typeof lpaCode !== 'string') {
		throw ApiError.withMessage(400, 'lpa-code is required');
	}
	const isDecidedOnly = decidedOnly === 'true';
	try {
		const count = await repo.countByLpaCode({ lpaCode, decidedOnly: isDecidedOnly });
		res.status(200).send({ count });
	} catch (err) {
		logger.error({ error: err, lpaCode, decidedOnly }, 'error counting cases by lpa code');
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

module.exports = {
	list,
	getByCaseReference,
	getCount
};
