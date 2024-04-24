const LpaService = require('../../../lpa.service');
const lpaService = new LpaService();
const ApiError = require('../../../../errors/apiError');

// /**
//  *
//  * @param {import('src/spec/api-types').AppealSubmission['appeal']} appeal
//  * @returns
//  */
// exports.formatter = async (appeal) => {
// 	if (!appeal) throw new Error(`Appeal could not be formatted`);

// 	let lpa;

// 	try {
// 		lpa = await lpaService.getLpaByCode(appeal.lpaCode);
// 	} catch (err) {
// 		lpa = await lpaService.getLpaById(appeal.lpaCode);
// 	}

// 	if (!lpa) {
// 		throw ApiError.lpaNotFound();
// 	}

// 	return [
// 		{
// 			appeal: {
// 				LPACode: lpa.getLpaCode(), // use Q9999 format, appeal uses E69999999
// 				LPAName: lpa.getName(),
// 				appealType: 'Householder (HAS) Appeal',
// 				isListedBuilding: false,
// 				decision: appeal.eligibility.applicationDecision,
// 				originalCaseDecisionDate: appeal.decisionDate.toISOString(),
// 				costsAppliedForIndicator: false,
// 				LPAApplicationReference: appeal.planningApplicationNumber,
// 				appellant: {
// 					firstName: appeal.aboutYouSection.yourDetails.isOriginalApplicant
// 						? appeal.aboutYouSection.yourDetails.name.split(' ')[0]
// 						: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ')[0],
// 					lastName: appeal.aboutYouSection.yourDetails.isOriginalApplicant
// 						? appeal.aboutYouSection.yourDetails.name.split(' ').splice(1)?.join(' ')
// 						: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ').slice(1)?.join(' '),
// 					emailAddress: appeal.aboutYouSection.yourDetails.isOriginalApplicant
// 						? appeal.email
// 						: undefined
// 				},
// 				agent: !appeal.aboutYouSection.yourDetails.isOriginalApplicant
// 					? {
// 							firstName: appeal.aboutYouSection.yourDetails.name.split(' ')[0],
// 							lastName: appeal.aboutYouSection.yourDetails.name.split(' ').splice(1)?.join(' '),
// 							emailAddress: appeal.email
// 					  }
// 					: undefined,
// 				siteAddressLine1: appeal.appealSiteSection.siteAddress.addressLine1,
// 				siteAddressLine2: appeal.appealSiteSection.siteAddress.addressLine2,
// 				siteAddressTown: appeal.appealSiteSection.siteAddress.town,
// 				siteAddressCounty: appeal.appealSiteSection.siteAddress.county,
// 				siteAddressPostcode: appeal.appealSiteSection.siteAddress.postcode,
// 				isSiteFullyOwned: appeal.appealSiteSection.siteOwnership.ownsWholeSite,
// 				hasToldOwners: !appeal.appealSiteSection.siteOwnership.ownsWholeSite
// 					? appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold
// 					: undefined,
// 				isSiteVisible: appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
// 				inspectorAccessDetails: !appeal.appealSiteSection.siteAccess
// 					.canInspectorSeeWholeSiteFromPublicRoad
// 					? appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted
// 					: undefined,
// 				doesSiteHaveHealthAndSafetyIssues: appeal.appealSiteSection.healthAndSafety.hasIssues,
// 				healthAndSafetyIssuesDetails: appeal.appealSiteSection.healthAndSafety.hasIssues
// 					? appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues
// 					: undefined
// 			},
// 			// todo we need to fix the formatting on these and there is technical debt in order to collect the correct metadata, commenting out for now as BO are not yet ready for this
// 			documents: []
// 		}
// 	];
// };

/**
 *
 * @param {import('src/spec/api-types').AppellantSubmission} appellantSubmission
 * @returns
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

	// extract relevant address

	return [
		{
			appeal: {
				LPACode: lpa.getLpaCode(), // use Q9999 format, appeal uses E69999999
				LPAName: lpa.getName(),
				appealType: 'Householder (HAS) Appeal',
				isListedBuilding: false,
				// decision: appeal.eligibility.applicationDecision,
				// originalCaseDecisionDate: appeal.decisionDate.toISOString(),
				// costsAppliedForIndicator: false,
				// LPAApplicationReference: appellantSubmission.applicationReference,
				// appellant: {
				// 	firstName: appeal.aboutYouSection.yourDetails.isOriginalApplicant
				// 		? appeal.aboutYouSection.yourDetails.name.split(' ')[0]
				// 		: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ')[0],
				// 	lastName: appeal.aboutYouSection.yourDetails.isOriginalApplicant
				// 		? appeal.aboutYouSection.yourDetails.name.split(' ').splice(1)?.join(' ')
				// 		: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ').slice(1)?.join(' '),
				// 	emailAddress: appeal.aboutYouSection.yourDetails.isOriginalApplicant
				// 		? appeal.email
				// 		: undefined
				// },
				// agent: !appeal.aboutYouSection.yourDetails.isOriginalApplicant
				// 	? {
				// 			firstName: appeal.aboutYouSection.yourDetails.name.split(' ')[0],
				// 			lastName: appeal.aboutYouSection.yourDetails.name.split(' ').splice(1)?.join(' '),
				// 			emailAddress: appeal.email
				// 	  }
				// 	: undefined,
				// siteAddressLine1: appeal.appealSiteSection.siteAddress.addressLine1,
				// siteAddressLine2: appeal.appealSiteSection.siteAddress.addressLine2,
				// siteAddressTown: appeal.appealSiteSection.siteAddress.town,
				// siteAddressCounty: appeal.appealSiteSection.siteAddress.county,
				// siteAddressPostcode: appeal.appealSiteSection.siteAddress.postcode,
				isSiteFullyOwned: appellantSubmission.ownsAllLand,
				hasToldOwners: !appellantSubmission.ownsAllLand
					? appellantSubmission.informedOwners
					: undefined,
				isSiteVisible: appellantSubmission.appellantSiteAccess,
				inspectorAccessDetails: appellantSubmission.appellantSiteAccess
					? appellantSubmission.appellantSiteAccess_appellantSiteAccessDetails
					: undefined,
				doesSiteHaveHealthAndSafetyIssues: appellantSubmission.appellantSiteSafety,
				healthAndSafetyIssuesDetails: appellantSubmission.appellantSiteSafety
					? appellantSubmission.appellantsiteSafety_appellantSiteAccessDetails
					: undefined
			},
			// todo we need to fix the formatting on these and there is technical debt in order to collect the correct metadata, commenting out for now as BO are not yet ready for this
			documents: []
		}
	];
};
