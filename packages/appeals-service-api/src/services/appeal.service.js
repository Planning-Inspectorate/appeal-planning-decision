// TODO: the functions here shouldn't be sending API responses since they shouldnt know
// they're being invoked in the context of a web request. These responses should be sent
// in the relevant router.
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
const OrganisationNamesValueObject = require('../value-objects/appeal/organisation-names.value')

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

/**
 *
 * @param {*} appeal 
 * @returns {OrganisationNamesDto}
 */
function getOrganisationNames(appeal) {
	// TODO: pull this into an appeal model when its eventually created
	
	logger.debug(appeal, "Getting organisation names from appeal")
	if (appeal.appealType !== '1005') {
		logger.debug("Appeal is not a full appeal, so no organisation names should be specified")
		return new OrganisationNamesValueObject();
	}

	logger.debug("Appeal is a full appeal, so organisation names may be specified")
	const contactOrganisationName = appeal.contactDetailsSection.contact?.companyName
	logger.debug(`The basic contact organisation name has been specified as: '${contactOrganisationName}'`)
	if (appeal.contactDetailsSection.isOriginalApplicant) {
		logger.debug(`Appeal is being submitted by the original applicant, so '${contactOrganisationName}' will be returned`)
		return new OrganisationNamesValueObject(contactOrganisationName);
	}

	logger.debug(`Appeal is being submitted by an agent, so '${contactOrganisationName}' will be returned as their company name`);
	const appealingOnBehalfOfCompanyName = appeal.contactDetailsSection.appealingOnBehalfOf?.companyName;
	logger.debug(`The company name of the original applicant has been specified as '${appealingOnBehalfOfCompanyName}' so this will be returned as well`);
	return new OrganisationNamesValueObject(
		appealingOnBehalfOfCompanyName,
		contactOrganisationName
	);
}

module.exports = {
	createAppeal,
	getAppeal,
	updateAppeal,
	validateAppeal,
	getDocumentInBase64Encoding,
	saveAppealAsSubmittedToBackOffice,
	getOrganisationNames
};
