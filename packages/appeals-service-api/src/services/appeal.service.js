// TODO: the functions here shouldn't be sending API responses since they shouldnt know
// they're being invoked in the context of a web request. These responses should be sent
// in the relevant router.
const jp = require('jsonpath');
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');
const logger = require('../lib/logger');
const ApiError = require('../errors/apiError');
const validateFullAppeal = require('../validators/validate-full-appeal');
const { validateAppeal } = require('../validators/validate-appeal');
const {
	AppealsRepository: AppealsCosmosRepository
} = require('../repositories/appeals-repository');
const {
	AppealsRepository: AppealsSQLRepository
} = require('../repositories/sql/appeals-repository');
const { AppealUserRepository } = require('../repositories/sql/appeal-user-repository');
const uuid = require('uuid');
const DocumentService = require('./document.service');
const AppealContactValueObject = require('../value-objects/appeal/contact.value');
const AppealContactsValueObject = require('../value-objects/appeal/contacts.value');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const appealsCosmosRepository = new AppealsCosmosRepository();
const appealsSQLRepository = new AppealsSQLRepository();
const appealUserRepository = new AppealUserRepository();

const documentService = new DocumentService();

/**
 * @typedef {import('src/spec/api-types').AppealSubmission} AppealSubmission
 */

async function createAppeal(req, res) {
	const appeal = {};

	const now = new Date(new Date().toISOString());
	appeal.id = uuid.v4();
	appeal.createdAt = now;
	appeal.updatedAt = now;

	logger.debug(`Creating appeal ${appeal.id} ...`);
	logger.debug({ appeal }, 'Appeal data in createAppeal');

	const document = await appealsCosmosRepository.create(appeal);
	const sqlAppeal = await appealsSQLRepository.createAppeal({
		legacyAppealSubmissionId: appeal.id
	});

	if (document.result && document.result.ok) {
		logger.debug(`Appeal ${appeal.id} created`);
		appeal.appealSqlId = sqlAppeal.id;
		res.status(201).send(appeal);
		return;
	}

	logger.error(`Problem while ${appeal.id} created`);
	res.status(500).send(appeal);
}

/**
 * @param {string} id
 * @returns {Promise<AppealSubmission['appeal']>}
 */
async function getAppeal(id) {
	logger.info(`Retrieving appeal ${id} ...`);
	const document = await appealsCosmosRepository.getById(id);

	if (document === null) {
		logger.info(`Appeal ${id} not found`);
		throw ApiError.appealNotFound(id);
	}

	logger.info(`Appeal ${id} retrieved`);
	return document.appeal;
}

async function getAppealByLPACodeAndId(lpaCode, id) {
	logger.info(`Retrieving appeal ${id} ... for lpaCode ${lpaCode}`);
	const document = await appealsCosmosRepository.getByLPACodeAndId(lpaCode, id);

	if (document === null) {
		logger.info(`Appeal ${id} not found`);
		throw ApiError.appealNotFound(id);
	}

	logger.info(`Appeal ${id} retrieved`);
	return document.appeal;
}

async function getAppealByHorizonId(horizonId) {
	logger.info(`Retrieving appeal ${horizonId} ...`);
	const document = await appealsCosmosRepository.getByHorizonId(horizonId);

	if (document === null) {
		logger.info(`Appeal ${horizonId} not found`);
		throw ApiError.appealNotFoundHorizonId(horizonId);
	}

	logger.info(`Appeal ${horizonId} retrieved`);
	return document.appeal;
}

function isValidAppeal(appeal) {
	if (!appeal.appealType) {
		return true;
	}

	if (appeal.appealType === APPEAL_ID.ENFORCEMENT_NOTICE || APPEAL_ID.ENFORCEMENT_LISTED_BUILDING) {
		return true;
	}

	let errors;

	// we do not use v1 validators for s20 listed building appeal but we need to validate
	// the object created in before you start journey which may have s20 listed building type
	// so we use full appeal validator in this context
	if (
		appeal.appealType === APPEAL_ID.PLANNING_SECTION_78 ||
		appeal.appealType === APPEAL_ID.PLANNING_LISTED_BUILDING ||
		appeal.appealType === APPEAL_ID.MINOR_COMMERCIAL ||
		appeal.appealType === APPEAL_ID.ADVERTISEMENT ||
		appeal.appealType === APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
	) {
		errors = validateFullAppeal(appeal);
	} else {
		errors = validateAppeal(appeal);
	}

	if (errors.length > 0) {
		logger.debug(`Validated payload for appeal update generated errors:\n ${appeal}\n${errors}`);
		throw ApiError.badRequest({ errors });
	}

	return errors.length === 0;
}

async function updateAppeal(id, appealUpdate) {
	logger.debug(appealUpdate, `Attempting to update appeal with ID ${id} with`);

	const savedAppealEntity = await appealsCosmosRepository.getById(id);

	if (savedAppealEntity === null) {
		throw ApiError.appealNotFound(id);
	}

	let appeal = savedAppealEntity.appeal;

	// set link to user
	await linkToUser(appeal, appealUpdate);

	Object.assign(appeal, appealUpdate);
	isValidAppeal(appeal);

	appeal.updatedAt = new Date(new Date().toISOString());
	const updatedAppealEntity = await appealsCosmosRepository.update(appeal);
	const updatedAppeal = updatedAppealEntity.value.appeal;

	if (Object.hasOwn(appealUpdate, 'state') || Object.hasOwn(appealUpdate, 'decisionDate')) {
		await appealsSQLRepository.updateAppealByLegacyAppealSubmissionId({
			legacyAppealSubmissionId: id,
			legacyAppealSubmissionDecisionDate: appealUpdate.decisionDate,
			legacyAppealSubmissionState: appealUpdate.state
		});
	}

	logger.debug(updatedAppeal, `Appeal updated to`);
	return updatedAppeal;
}

/**
 * @param {string} id
 */
async function deleteAppeal(id) {
	logger.info(`Attempting to delete appeal with ID ${id}`);

	await appealsCosmosRepository.delete(id);

	logger.info(`Appeal ${id} deleted`);
}

/**
 * @param {*} appeal - existing appeal
 * @param {*} appealUpdate - updated appeal
 * @returns {Promise<void>}
 */
async function linkToUser(appeal, appealUpdate) {
	/** @type {import('@pins/common/src/constants').AppealToUserRoles|undefined} */
	let role;

	/**
	 * checks new bool is defined and is different from original bool
	 * @param {boolean|undefined} original
	 * @param {boolean|undefined} update
	 * @returns {boolean}
	 */
	function isBoolChanged(original, update) {
		return update !== undefined && (original === undefined || update !== original);
	}

	const currentIsOrigApplicantS78 = appeal?.contactDetailsSection?.isOriginalApplicant;
	const updateIsOrigApplicantS78 = appealUpdate?.contactDetailsSection?.isOriginalApplicant;
	if (isBoolChanged(currentIsOrigApplicantS78, updateIsOrigApplicantS78)) {
		role = updateIsOrigApplicantS78 ? APPEAL_USER_ROLES.APPELLANT : APPEAL_USER_ROLES.AGENT;
	}

	const currentIsOrigApplicantHAS = appeal?.aboutYouSection?.yourDetails?.isOriginalApplicant;
	const updateIsOrigApplicantHAS = appealUpdate?.aboutYouSection?.yourDetails?.isOriginalApplicant;
	if (isBoolChanged(currentIsOrigApplicantHAS, updateIsOrigApplicantHAS)) {
		role = updateIsOrigApplicantHAS ? APPEAL_USER_ROLES.APPELLANT : APPEAL_USER_ROLES.AGENT;
	}

	if (!role) {
		return;
	}

	const emailAddress = appeal.email ? appeal.email : appealUpdate.email;

	if (!emailAddress) {
		logger.info(`Cannot link user to appeal with no email: ${appealUpdate.id}`);
		return;
	}

	const sqlData = await Promise.all([
		appealUserRepository.getByEmail(emailAddress),
		appealsSQLRepository.getByLegacyId(appealUpdate.id)
	]).catch((err) => {
		logger.error(err);
		throw ApiError.withMessage(500, 'failed to find user or appeal to link');
	});

	const sqlUser = sqlData[0];
	const sqlAppeal = sqlData[1];

	if (!sqlUser) {
		throw ApiError.userNotFound();
	}

	if (!sqlAppeal) {
		throw ApiError.appealNotFound();
	}

	logger.info(`set role: ${role} between user: ${sqlUser.id} and appeal: ${sqlAppeal.id}`);

	await appealUserRepository.linkUserToAppeal(sqlUser.id, sqlAppeal.id, role);
}

/**
 *
 * @param {*} appeal
 * @param {*} documentId
 * @returns An {@link ApiError} if:
 * <ul>
 *  <li>No appeal with the ID specified is found</li>
 * 	<li>No document with the ID specified is found on the appeal</li>
 * </ul>
 *
 * Otherwise, returns JSON that respresents the document requested in base64 encoding.
 */
async function getAppealDocumentInBase64Encoding(appeal, documentId) {
	return await documentService.getAppealDocumentInBase64Encoding(appeal.id, documentId);
}

/**
 * @param {any} appeal
 * @param {string} horizonCaseReference
 * @param {string} horizonCaseReferenceFull
 * @returns {Promise<any>}
 */
async function saveAppealAsSubmittedToBackOffice(
	appeal,
	horizonCaseReference,
	horizonCaseReferenceFull
) {
	logger.debug(
		appeal,
		`Saving the following appeal as submitted to the back office, with a case reference of ${horizonCaseReference}`
	);
	appeal.submissionDate = new Date(new Date().toISOString());
	appeal.state = 'SUBMITTED';
	appeal.horizonId = horizonCaseReference;
	appeal.horizonIdFull = horizonCaseReferenceFull;
	logger.debug(appeal, 'Appeal after setting "submitted to back-office" updates');
	return await updateAppeal(appeal.id, appeal);
}

/**
 *
 * @param {*} appeal
 * @returns {AppealContactsValueObject}
 */
function getContactDetails(appeal) {
	// TODO: pull this into an appeal model when its eventually created
	logger.debug(appeal, 'Getting contact details from appeal');

	const appealIsAFullAppeal = appeal.appealType == '1005';

	// Due to the difference in JSON structure between full/householder appeals for contact details,
	// we'll initialise these here, but set them below according to the appeal type...
	let appellantCompanyName;
	let appellantName;
	let appellantEmail;
	let agentCompanyName;
	let agentName;
	let agentEmail;

	if (appealIsAFullAppeal) {
		// Full appeals can have company names, so they're set-up as part of this logic branch.
		appellantCompanyName = appeal.contactDetailsSection.contact?.companyName;
		appellantName = appeal.contactDetailsSection.contact.name;
		appellantEmail = appeal.email;

		const anAgentIsAppealingOnBehalfOfAnAppellant =
			!appeal.contactDetailsSection.isOriginalApplicant;
		if (anAgentIsAppealingOnBehalfOfAnAppellant) {
			// The appellant gets the "appealingOnBehalfOf" details from the appeal,
			// and the agent gets the appellant details from the appeal. The appellant's
			// email is not collected since its not required and we want to store
			// as little information as possible about people due to GDPR.
			appellantCompanyName = appeal.contactDetailsSection.appealingOnBehalfOf?.companyName;
			appellantName = appeal.contactDetailsSection.appealingOnBehalfOf.name;
			appellantEmail = null;

			agentCompanyName = appeal.contactDetailsSection.contact?.companyName;
			agentName = appeal.contactDetailsSection.contact.name;
			agentEmail = appeal.email;
		}
	} else {
		// Non-full appeals will not have company names, so they're ignored in this branch.
		appellantName = appeal.aboutYouSection.yourDetails.name;
		appellantEmail = appeal.email;

		const anAgentIsAppealingOnBehalfOfAnAppellant =
			!appeal.aboutYouSection.yourDetails.isOriginalApplicant;
		if (anAgentIsAppealingOnBehalfOfAnAppellant) {
			// The appellant gets the "appealingOnBehalfOf" details from the appeal,
			// and the agent gets the appellant details from the appeal. The appellant's
			// email is not collected since its not required and we want to store
			// as little information as possible about people due to GDPR.
			appellantName = appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;
			appellantEmail = null;

			agentName = appeal.aboutYouSection.yourDetails.name;
			agentEmail = appeal.email;
		}
	}

	logger.debug(`Appellant company name: ${appellantCompanyName}`);
	logger.debug(`Appellant name: ${appellantName}`);
	logger.debug(`Appellant email: ${appellantEmail}`);
	logger.debug(`Agent company name: ${appellantCompanyName}`);
	logger.debug(`Agent name: ${agentName}`);
	logger.debug(`Agent email: ${agentEmail}`);

	return new AppealContactsValueObject(
		new AppealContactValueObject(appellantCompanyName, appellantName, appellantEmail),
		new AppealContactValueObject(agentCompanyName, agentName, agentEmail)
	);
}

function getDocumentIds(appeal) {
	// TODO: pull this into an appeal model when its eventually created
	return getAllDocuments(appeal)
		.filter((document) => document.id)
		.map((document) => document.id);
}

/////////////////////////////
///// PRIVATE FUNCTIONS /////
/////////////////////////////

function getAllDocuments(appeal) {
	// TODO: pull this into an appeal model when its eventually created
	return [
		...jp.query(appeal, '$..uploadedFile').flat(Infinity),
		...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	];
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	deleteAppeal,
	validateAppeal,
	getAppealDocumentInBase64Encoding,
	getAppealByLPACodeAndId,
	saveAppealAsSubmittedToBackOffice,
	getContactDetails,
	getDocumentIds,
	getAppealByHorizonId
};
