const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const { AppealCaseRepository } = require('./repo');
const {
	getCaseAndAppellant,
	putCase,
	listByLpaCodeWithAppellant,
	listByPostcodeWithAppellant
} = require('./service');

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
		// only check published cases
		const appealCase = await getCaseAndAppellant({ caseReference });
		if (!appealCase) {
			throw ApiError.withMessage(404, 'not found');
		}
		res.status(200).send(appealCase);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw 404
		}
		logger.error({ error: err, caseReference }, 'error fetching case by reference');
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function putByCaseReference(req, res) {
	const { caseReference } = req.params;

	if (!caseReference) {
		throw ApiError.withMessage(400, 'case reference is required');
	}
	try {
		const appealCase = await putCase(caseReference, req.body);
		res.status(200).send(appealCase);
	} catch (err) {
		if (err instanceof ApiError) {
			throw err; // re-throw service errors
		}
		logger.error({ error: err, caseReference }, 'error upserting case by reference');
		throw ApiError.withMessage(500, 'unexpected error');
	}
}

/**
 * @type {import('express').RequestHandler}
 */
async function list(req, res, next) {
	if ('lpa-code' in req.query) {
		await listByLpaCode(req, res, next);
		return;
	}
	if ('postcode' in req.query) {
		await listByPostcode(req, res, next);
		return;
	}
	throw ApiError.withMessage(400, 'lpa-code || postcode is required');
}

/**
 * @type {import('express').RequestHandler}
 */
async function listByLpaCode(req, res) {
	const {
		'lpa-code': lpaCode,
		'decided-only': decidedOnly,
		'with-appellant': withAppellant
	} = req.query;

	if (!lpaCode || typeof lpaCode !== 'string') {
		throw ApiError.withMessage(400, 'lpa-code is required');
	}
	if (!isValidBooleanString(decidedOnly)) {
		throw ApiError.withMessage(400, 'decided-only must be true or false');
	}
	if (!isValidBooleanString(withAppellant)) {
		throw ApiError.withMessage(400, 'with-appellant must be true or false');
	}
	const isDecidedOnly = decidedOnly === 'true';
	const isWithAppellant = withAppellant === 'true';
	try {
		const appealCases = await listByLpaCodeWithAppellant({
			lpaCode,
			decidedOnly: isDecidedOnly,
			withAppellant: isWithAppellant
		});
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
	const {
		postcode: postcode,
		'decided-only': decidedOnly,
		'with-appellant': withAppellant
	} = req.query;

	if (!postcode || typeof postcode !== 'string') {
		throw ApiError.withMessage(400, 'postcode is required');
	}
	if (!isValidBooleanString(decidedOnly)) {
		throw ApiError.withMessage(400, 'decided-only must be true or false');
	}
	if (!isValidBooleanString(withAppellant)) {
		throw ApiError.withMessage(400, 'with-appellant must be true or false');
	}
	const isDecidedOnly = decidedOnly === 'true';
	const isWithAppellant = withAppellant === 'true';
	try {
		const appealCases = await listByPostcodeWithAppellant({
			postcode,
			decidedOnly: isDecidedOnly,
			withAppellant: isWithAppellant
		});
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
		await countByLpaCode(req, res, next);
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
	if (!isValidBooleanString(decidedOnly)) {
		throw ApiError.withMessage(400, 'decided-only must be true or false');
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

/**
 * @param {any|undefined} bool
 * @returns {boolean}
 */
function isValidBooleanString(bool) {
	if (bool === undefined) {
		return true;
	}
	return bool === 'true' || bool === 'false';
}

module.exports = {
	list,
	getByCaseReference,
	putByCaseReference,
	getCount
};
