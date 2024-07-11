const LpaService = require('../../../lpa.service');
const lpaService = new LpaService();
const ApiError = require('../../../../errors/apiError');
const {
	// getDocuments,
	formatApplicationSubmissionUsers,
	formatApplicationDecision,
	formatYesNoSomeAnswer
} = require('../utils');
const deadlineDate = require('@pins/business-rules/src/rules/appeal/deadline-date');
const { APPEAL_ID } = require('@pins/business-rules/src/constants');

/**
 * @typedef {import ('pins-data-model').Schemas.AppellantSubmissionCommand} AppellantSubmissionCommand
 * @typedef {import('@prisma/client').Prisma.AppellantSubmissionGetPayload<{
 *   include: {
 *     SubmissionDocumentUpload: true,
 *     SubmissionAddress: true,
 *     SubmissionLinkedCase: true,
 * 		 SubmissionListedBuilding: true,
 *		 Appeal: {
 *       include: {
 *			   Users: {
 *           include: {
 *             AppealUser: true
 *           }
 *         }
 *		   }
 *     }
 *   }
 * }>} AppellantSubmission
 */

/**
 * @param {AppellantSubmission} appellantSubmission
 * @returns {Promise<AppellantSubmissionCommand>}
 */
exports.formatter = async (appellantSubmission) => {
	if (!appellantSubmission) throw new Error(`Appeal submission could not be formatted`);

	let lpa;

	try {
		lpa = await lpaService.getLpaByCode(appellantSubmission.LPACode);
	} catch (err) {
		lpa = await lpaService.getLpaById(appellantSubmission.LPACode);
	}

	if (!lpa) {
		throw ApiError.lpaNotFound();
	}

	const address = appellantSubmission.SubmissionAddress?.find(
		(address) => address.fieldName === 'siteAddress'
	);

	return {
		casedata: {
			caseType: 'D',
			caseProcedure: 'written',
			lpaCode: lpa.getLpaCode(),
			caseSubmittedDate: new Date().toISOString(),
			enforcementNotice: false, // this will eventually come from before you start
			applicationReference: appellantSubmission.applicationReference ?? '',
			applicationDate: appellantSubmission.onApplicationDate?.toISOString() ?? null,
			applicationDecision: formatApplicationDecision(appellantSubmission.applicationDecision),
			applicationDecisionDate: appellantSubmission.applicationDecisionDate?.toISOString() ?? null,
			caseSubmissionDueDate: deadlineDate(
				appellantSubmission.applicationDecisionDate,
				APPEAL_ID.PLANNING_SECTION_78,
				appellantSubmission.applicationDecision
			).toISOString(),
			siteAddressLine1: address.addressLine1 ?? '',
			siteAddressLine2: address.addressLine2 ?? '',
			siteAddressTown: address.townCity ?? '',
			siteAddressCounty: address.county ?? '',
			siteAddressPostcode: address.postcode ?? '',
			siteAccessDetails: [
				appellantSubmission.appellantSiteAccess_appellantSiteAccessDetails
			].filter(Boolean),
			siteSafetyDetails: [
				appellantSubmission.appellantSiteSafety_appellantSiteSafetyDetails
			].filter(Boolean),
			isGreenBelt: appellantSubmission.appellantGreenBelt ?? null,
			siteAreaSquareMetres: Number(appellantSubmission.siteAreaSquareMetres) ?? null,
			floorSpaceSquareMetres: Number(appellantSubmission.siteAreaSquareMetres) ?? null,
			ownsAllLand: appellantSubmission.ownsAllLand ?? null,
			ownsSomeLand: appellantSubmission.ownsSomeLand ?? null,
			knowsOtherOwners: formatYesNoSomeAnswer(appellantSubmission.knowsOtherOwners),
			knowsAllOwners: formatYesNoSomeAnswer(appellantSubmission.knowsAllOwners),
			advertisedAppeal: appellantSubmission.advertisedAppeal ?? null,
			ownersInformed: appellantSubmission.informedOwners ?? null,
			originalDevelopmentDescription: appellantSubmission.developmentDescriptionOriginal ?? null,
			changedDevelopmentDescription: appellantSubmission.updateDevelopmentDescription ?? null,
			nearbyCaseReferences: appellantSubmission.SubmissionLinkedCase?.map(
				({ caseReference }) => caseReference
			),
			neighbouringSiteAddresses: null, // added by the LPA later I believe
			appellantCostsAppliedFor: appellantSubmission.costApplication ?? null
		},
		documents: [],
		// documents: await getDocuments(appellantSubmission),
		users: formatApplicationSubmissionUsers(appellantSubmission)
	};
};
