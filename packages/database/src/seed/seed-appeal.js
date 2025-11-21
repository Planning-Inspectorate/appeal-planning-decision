const { pickRandom, datesNMonthsAgo, datesNMonthsAhead } = require('./util');
const {
	APPEAL_CASE_STATUS,
	APPEAL_CASE_PROCEDURE,
	SERVICE_USER_TYPE
} = require('@planning-inspectorate/data-model');
const { randomUUID } = require('crypto');

/**
 * @typedef {import('@pins/database/src/client').Prisma.AppealCaseCreateWithoutAppealInput} AppealCreate
 * @typedef {import('@pins/database/src/client').Prisma.ServiceUserCreateInput} ServiceUserCreate
 * @typedef {import('@pins/database/src/client').Prisma.RepresentationCreateInput} RepresentationCreate
 */

const commonAppealProps = {
	applicationDate: pickRandom(datesNMonthsAgo(5)),
	applicationDecisionDate: pickRandom(datesNMonthsAgo(4)),
	caseSubmittedDate: pickRandom(datesNMonthsAgo(1)),
	caseCreatedDate: pickRandom(datesNMonthsAgo(1)),
	caseValidDate: pickRandom(datesNMonthsAgo(1)),
	casePublishedDate: pickRandom(datesNMonthsAgo(1)),

	siteAddressLine2: null,
	siteAddressTown: 'Town',
	siteAddressCounty: 'Countyshire',
	siteAddressPostcode: 'BS1 6PN',

	appellantCostsAppliedFor: false,
	applicationDecision: 'refused'
};

/**
 * @param {{
 * 	firstName: string,
 * 	emailAddress?: string,
 * 	serviceUserType: string,
 * 	caseReference: string
 * }} param0
 * @returns {ServiceUserCreate}
 */
const createServiceUser = ({ firstName, emailAddress, serviceUserType, caseReference }) => {
	return {
		id: randomUUID().toString(),
		firstName,
		lastName: 'seeded-user',
		emailAddress,
		caseReference,
		serviceUserType
	};
};

/**
 * @param {{
 *  id?: string,
 * 	friendlyName: string,
 * 	caseReference: string,
 * 	lpaCode: string,
 * 	processCode: string,
 * 	appealCaseProcedure?: string,
 *  appealCaseStatus?: string,
 *  submittingUser: { email: string, id: string },
 *  isAgent?: boolean
 * }} param0
 * @returns {{
 *  appeal: AppealCreate,
 *  appellant: ServiceUserCreate,
 *  agent?: ServiceUserCreate,
 *  canHaveRule6: boolean
 * }}
 */
module.exports.getAppealInState = ({
	id = randomUUID().toString(),
	friendlyName,
	caseReference,
	lpaCode,
	processCode,
	appealCaseProcedure = APPEAL_CASE_PROCEDURE.WRITTEN,
	appealCaseStatus = APPEAL_CASE_STATUS.ASSIGN_CASE_OFFICER,
	submittingUser,
	isAgent = true
}) => {
	/** @type {AppealCreate} */
	const appeal = {
		...commonAppealProps,
		id,
		LPACode: lpaCode,
		caseReference: caseReference,
		siteAddressLine1: friendlyName,
		applicationReference: encodeURIComponent(friendlyName),
		CaseType: { connect: { processCode: processCode } },
		ProcedureType: { connect: { key: appealCaseProcedure } },
		CaseStatus: { connect: { key: appealCaseStatus } }
	};

	let canHaveRule6 = false;

	switch (appealCaseStatus) {
		// LPAQ
		case APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE:
			appeal.lpaQuestionnaireDueDate = pickRandom(datesNMonthsAhead(1));
			appeal.caseStartedDate = new Date();
			break;
		// Statements
		case APPEAL_CASE_STATUS.STATEMENTS:
			appeal.lpaQuestionnaireDueDate = pickRandom(datesNMonthsAgo(1));
			appeal.statementDueDate = pickRandom(datesNMonthsAhead(1));
			appeal.caseStartedDate = new Date();
			appeal.lpaQuestionnaireDueDate = new Date();
			appeal.LPAStatementSubmittedDate = null;
			appeal.appellantStatementSubmittedDate = null;
			canHaveRule6 = true;
			break;
		// EVIDENCE
		case APPEAL_CASE_STATUS.EVIDENCE:
			appeal.proofsOfEvidenceDueDate = pickRandom(datesNMonthsAhead(1));
			appeal.caseStartedDate = new Date();
			appeal.lpaQuestionnaireDueDate = new Date();
			appeal.LPAProofsSubmittedDate = null;
			appeal.appellantProofsSubmittedDate = null;
			canHaveRule6 = true;
			break;
		// Final Comments
		case APPEAL_CASE_STATUS.FINAL_COMMENTS:
			appeal.finalCommentsDueDate = pickRandom(datesNMonthsAhead(1));
			appeal.caseStartedDate = new Date();
			appeal.lpaQuestionnaireDueDate = new Date();
			appeal.LPACommentsSubmittedDate = null;
			appeal.appellantCommentsSubmittedDate = null;
			canHaveRule6 = true;
			break;
		// Decision
		case APPEAL_CASE_STATUS.COMPLETE:
			appeal.caseStartedDate = new Date();
			appeal.lpaQuestionnaireDueDate = new Date();
			appeal.CaseDecisionOutcome = { connect: { key: 'Allowed' } };
			appeal.caseDecisionOutcomeDate = new Date();
			appeal.caseDecisionPublishedDate = new Date();
			break;
		default:
			break;
	}

	const mainServiceUser = createServiceUser({
		firstName: 'contact',
		emailAddress: submittingUser.email,
		serviceUserType: isAgent ? SERVICE_USER_TYPE.AGENT : SERVICE_USER_TYPE.APPELLANT,
		caseReference: caseReference
	});

	const additionalAppellant = createServiceUser({
		firstName: 'appellant',
		serviceUserType: SERVICE_USER_TYPE.APPELLANT,
		caseReference: caseReference
	});

	return {
		appeal,
		appellant: isAgent ? additionalAppellant : mainServiceUser,
		agent: isAgent ? mainServiceUser : undefined,
		canHaveRule6
	};
};

/**
 * @param {number} startNumber
 * @param {Set<number>} existingReferences
 * @returns {number}
 */
module.exports.generateCaseRef = (startNumber, existingReferences) => {
	if (startNumber.toString().length !== 7) throw new Error('start number must be 7 digits');

	let nextNumber = startNumber;

	while (nextNumber <= 9999999) {
		if (!existingReferences.has(nextNumber)) return nextNumber;
		nextNumber++;
	}

	throw new Error('no more 7 digit refs available');
};
