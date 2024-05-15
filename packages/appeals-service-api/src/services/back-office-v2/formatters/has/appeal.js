const LpaService = require('../../../lpa.service');
const lpaService = new LpaService();
const ApiError = require('../../../../errors/apiError');

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

	const address = appellantSubmission.SubmissionAddress?.find(
		(address) => address.fieldName === 'siteAddress'
	);

	return [
		{
			appeal: {
				LPACode: lpa.getLpaCode(), // use Q9999 format, appeal uses E69999999
				LPAName: lpa.getName(),
				appealType: 'Householder (HAS) Appeal',
				isListedBuilding: false,
				decision: appellantSubmission.applicationDecision,
				// originalCaseDecisionDate: appellantSubmission.applicationDecisionDate.toISOString(),
				costsAppliedForIndicator: appellantSubmission.costApplication,
				LPAApplicationReference: appellantSubmission.applicationReference,
				appellant: {
					firstName: appellantSubmission.isAppellant
						? appellantSubmission.contactFirstName
						: appellantSubmission.appellantFirstName,
					lastName: appellantSubmission.isAppellant
						? appellantSubmission.contactLastName
						: appellantSubmission.appellantLastName,
					emailAddress: appellantSubmission.appellantEmailAddress
				},
				agent: !appellantSubmission.isAppellant
					? {
							firstName: appellantSubmission.contactFirstName,
							lastName: appellantSubmission.contactLastName,
							emailAddress: appellantSubmission.appellantEmailAddress
					  }
					: undefined,
				siteAddressLine1: address.addressLine1,
				siteAddressLine2: address.addressLine2,
				siteAddressTown: address.town,
				siteAddressCounty: address.county,
				siteAddressPostcode: address.postcode,
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
