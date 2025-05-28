const ApiError = require('#errors/apiError');
const logger = require('#lib/logger');
const BackOfficeV2Service = require('../../../../../services/back-office-v2');
const LpaService = require('../../../../../services/lpa.service');
const { getForBOSubmission } = require('../service');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const {
	formatter: hasFormatter
} = require('../../../../../services/back-office-v2/formatters/has/appeal');
const {
	formatter: s78Formatter
} = require('../../../../../services/back-office-v2/formatters/s78/appeal');
const { getUserById } = require('../../../users/service');

const lpaService = new LpaService();
const backOfficeV2Service = new BackOfficeV2Service();

/**
 * @typedef {import('../../repo').FullAppellantSubmission} FullAppellantSubmission
 * @typedef {import('../../../../../models/entities/lpa-entity')} LPA
 * @typedef {import('../../../../../services/back-office-v2/formatters/utils').AppellantSubmissionMapper} AppellantSubmissionMapper
 */

/**
 * @param {string|null} appealTypeCode
 * @returns {AppellantSubmissionMapper}
 */
const getFormatter = (appealTypeCode) => {
	switch (appealTypeCode) {
		case CASE_TYPES.HAS.processCode:
			return hasFormatter;
		case CASE_TYPES.S78.processCode:
			return s78Formatter;
		case CASE_TYPES.S20.processCode:
			//TODO: update/ create new formatter when data model confirmed
			return s78Formatter;
		case CASE_TYPES.ADVERTS.processCode:
		case CASE_TYPES.CAS_ADVERTS.processCode:
			//TODO: update/ create new formatter when data model confirmed
			return s78Formatter;
		case CASE_TYPES.CAS_PLANNING.processCode:
			//TODO: update/ create new formatter when data model confirmed
			return s78Formatter;
		default:
			throw new Error('unknown formatter');
	}
};

/** @type {import('express').Handler} */
exports.post = async (req, res) => {
	const userId = req.auth.payload.sub;

	if (!userId) throw ApiError.invalidToken();
	const { email } = await getUserById(userId);

	const appellantSubmission = await getAppellantSubmission(req.params.id, userId);

	const lpa = await getLpa(appellantSubmission);

	const formatter = getFormatter(appellantSubmission.appealTypeCode);

	try {
		await backOfficeV2Service.submitAppellantSubmission({
			appellantSubmission,
			email,
			lpa,
			formatter
		});
	} catch (err) {
		logger.error(err);
		throw ApiError.unableToSubmitAppellantSubmission();
	}

	res.sendStatus(200);
};

/**
 * @param {string} appellantSubmissionId
 * @param {string} userId
 * @returns {Promise<FullAppellantSubmission>}
 */
const getAppellantSubmission = async (appellantSubmissionId, userId) => {
	const appellantSubmission = await getForBOSubmission({ appellantSubmissionId, userId });
	if (!appellantSubmission) throw new Error(`Appeal submission ${appellantSubmissionId} not found`);
	return appellantSubmission;
};

/**
 * @param {FullAppellantSubmission} appellantSubmission
 * @returns {Promise<LPA>}
 */
const getLpa = async (appellantSubmission) => {
	let lpa;

	try {
		lpa = await lpaService.getLpaByCode(appellantSubmission.LPACode);
	} catch (err) {
		lpa = await lpaService.getLpaById(appellantSubmission.LPACode);
	}

	if (!lpa) {
		throw ApiError.lpaNotFound();
	}

	return lpa;
};
