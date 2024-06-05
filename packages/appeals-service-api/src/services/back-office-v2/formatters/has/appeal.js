const LpaService = require('../../../lpa.service');
const lpaService = new LpaService();
const ApiError = require('../../../../errors/apiError');
const { getDocuments, formatUsers, formatApplicationDecision } = require('../utils');
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
 * @returns {Promise<[AppellantSubmissionCommand]>}
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

	return [
		{
			casedata: {
				caseType: 'D',
				caseProcedure: 'written', // We keep this on Appeal cases, will one exist yet when this code is triggered?
				lpaCode: lpa.getLpaCode(),
				caseSubmittedDate: new Date().getTime().toString(),
				enforcementNotice: false, // this will eventually come from before you start
				applicationReference: appellantSubmission.applicationReference ?? '',
				applicationDate: appellantSubmission.onApplicationDate?.getTime().toString() ?? null,
				applicationDecision: formatApplicationDecision(appellantSubmission.applicationDecision),
				applicationDecisionDate: appellantSubmission.applicationDecisionDate ?? null,
				caseSubmissionDueDate: deadlineDate(
					appellantSubmission.applicationDecisionDate,
					APPEAL_ID.HOUSEHOLDER,
					appellantSubmission.applicationDecision
				),
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
				siteAreaSquareMetres: appellantSubmission.siteAreaSquareMetres ?? null,
				floorSpaceSquareMetres: appellantSubmission.siteAreaSquareMetres ?? null,
				ownsAllLand: appellantSubmission.ownsAllLand ?? null,
				ownsSomeLand: appellantSubmission.ownsSomeLand ?? null,
				knowsOtherOwners: appellantSubmission.knowsOtherOwners ?? null,
				knowsAllOwners: appellantSubmission.knowsAllOwners ?? null,
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
			documents: await getDocuments(appellantSubmission),
			users: formatUsers(appellantSubmission.Appeal.Users)
		}
	];
};
