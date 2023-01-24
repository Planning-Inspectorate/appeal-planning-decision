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
const { AppealsRepository } = require('../repositories/appeals-repository');
const uuid = require('uuid');
const DocumentService = require('./document.service');
const AppealContactValueObject = require('../value-objects/appeal/contact.value');
const AppealContactsValueObject = require('../value-objects/appeal/contacts.value');

const appealsRepository = new AppealsRepository();
const documentService = new DocumentService();

async function createAppeal(req, res) {
	const appeal = {};

	const now = new Date(new Date().toISOString());
	appeal.id = uuid.v4();
	appeal.createdAt = now;
	appeal.updatedAt = now;

	logger.debug(`Creating appeal ${appeal.id} ...`);
	logger.debug({ appeal }, 'Appeal data in createAppeal');

	const document = await appealsRepository.create(appeal);

	if (document.result && document.result.ok) {
		logger.debug(`Appeal ${appeal.id} created`);
		res.status(201).send(appeal);
		return;
	}

	logger.error(`Problem while ${appeal.id} created`);
	res.status(500).send(appeal);
}

async function getAppeal(id) {
	logger.info(`Retrieving appeal ${id} ...`);
	const document = await appealsRepository.getById(id);

	if (document === null) {
		logger.info(`Appeal ${id} not found`);
		throw ApiError.appealNotFound(id);
	}

	logger.info(`Appeal ${id} retrieved`);
	return document.appeal;
}

function isValidAppeal(appeal) {
	if (!appeal.appealType) {
		return true;
	}

	let errors;

	if (appeal.appealType === APPEAL_ID.PLANNING_SECTION_78) {
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

	const savedAppealEntity = await appealsRepository.getById(id);

	if (savedAppealEntity === null) {
		throw ApiError.appealNotFound(id);
	}

	let appeal = savedAppealEntity.appeal;
	Object.assign(appeal, appealUpdate);
	isValidAppeal(appeal);

	/* eslint no-param-reassign: ["error", { "props": false }] */
	appeal.updatedAt = new Date(new Date().toISOString());
	const updatedAppealEntity = await appealsRepository.update(appeal);
	const updatedAppeal = updatedAppealEntity.value.appeal;
	logger.debug(updatedAppeal, `Appeal updated to`);
	return updatedAppeal;
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
async function getDocumentInBase64Encoding(appeal, documentId) {
	logger.debug(appeal, `Getting documents in base64 encoding for appeal`);
	let documentIds = [];
	populateArrayWithIdsFromKeysFoundInObject(appeal, ['uploadedFile', 'uploadedFiles'], documentIds);
	let documentWithIdSpecifiedFromAppeal = documentIds.find((document) => document.id == documentId)
	if(documentWithIdSpecifiedFromAppeal === undefined) {
		throw new ApiError(404, `No document with ID ${documentId} could be found on appeal with ID ${appeal.id}`)
	}

	return await documentService.getAppealDocumentInBase64Encoding(appeal.id, documentWithIdSpecifiedFromAppeal.id);
}

function populateArrayWithIdsFromKeysFoundInObject(obj, keys, array) {
	for (let [k, v] of Object.entries(obj)) {
		if (keys.includes(k)) {
			if (Array.isArray(v)) {
				v.map((value) => array.push({ id: value.id }));
			} else {
				array.push({ id: v.id });
			}
		}

		if (typeof v === 'object' && v !== null) {
			let found = populateArrayWithIdsFromKeysFoundInObject(v, keys, array);
			if (found) return found;
		}
	}
}

async function saveAppealAsSubmittedToBackOffice(appeal, horizonCaseReference) {
	logger.debug(
		appeal,
		`Saving the following appeal as submitted to the back office, with a case reference of ${horizonCaseReference}`
	);
	appeal.submissionDate = new Date(new Date().toISOString());
	appeal.state = 'SUBMITTED';
	appeal.horizonId = horizonCaseReference;
	logger.debug(appeal, 'Appeal after setting "submitted to back-office" updates');
	return await updateAppeal(appeal.id, appeal);
}

function getContactDetails(appeal) {
	// TODO: pull this into an appeal model when its eventually created
	logger.debug(appeal, "Getting contact details from appeal")

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
		appellantCompanyName = appeal.contactDetailsSection.contact?.companyName
		appellantName = appeal.contactDetailsSection.contact.name;
		appellantEmail = appeal.email

		const anAgentIsAppealingOnBehalfOfAnAppellant = !appeal.contactDetailsSection.isOriginalApplicant
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
		appellantEmail = appeal.email

		const anAgentIsAppealingOnBehalfOfAnAppellant = !appeal.aboutYouSection.yourDetails.isOriginalApplicant;
		if (anAgentIsAppealingOnBehalfOfAnAppellant) {
			// The appellant gets the "appealingOnBehalfOf" details from the appeal,
			// and the agent gets the appellant details from the appeal. The appellant's
			// email is not collected since its not required and we want to store 
			// as little information as possible about people due to GDPR.
			appellantName = appeal.aboutYouSection.yourDetails.appealingOnBehalfOf;
			appellantEmail = null;

			agentName = appeal.aboutYouSection.yourDetails.name;
			agentEmail = appeal.email
		} 
	}

	logger.debug(`Appellant company name: ${appellantCompanyName}`)
	logger.debug(`Appellant name: ${appellantName}`)
	logger.debug(`Appellant email: ${appellantEmail}`)
	logger.debug(`Agent company name: ${appellantCompanyName}`)
	logger.debug(`Agent name: ${agentName}`)
	logger.debug(`Agent email: ${agentEmail}`)

	return new AppealContactsValueObject(
		new AppealContactValueObject(appellantCompanyName, appellantName, appellantEmail), 
		new AppealContactValueObject(agentCompanyName, agentName, agentEmail)
	);
}

function getDocumentIds(appeal) {
	// TODO: pull this into an appeal model when its eventually created
	return [
		...jp.query(appeal, '$..uploadedFile').flat(Infinity),
		...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	].filter(document => document.id)
	.map(document => document.id);
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	validateAppeal,
	getDocumentInBase64Encoding,
	saveAppealAsSubmittedToBackOffice,
	getContactDetails,
	getDocumentIds
};
