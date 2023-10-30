class HasAppealMapper {
	mapToPINSDataModel(appeal) {
		return [
			{
				appeal: {
					LPACode: appeal.LPACode,
					appealType: 'Householder (HAS) Appeal',
					isListedBuilding: false,
					decision: appeal.eligibility.applicationDecision,
					originalCaseDecisionDate: appeal.decisionDate.toISOString(),
					costsAppliedForIndicator: false,
					LPAApplicationReference: appeal.planningApplicationNumber,
					appellant: {
						firstName: appeal.aboutYouSection.yourDetails.isOriginalApplicant
							? appeal.aboutYouSection.yourDetails.name.split(' ')[0]
							: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf.split(' ')[0],
						lastName: appeal.aboutYouSection.yourDetails.isOriginalApplicant
							? appeal.aboutYouSection.yourDetails.name.split(' ').splice(1)?.join(' ')
							: appeal.aboutYouSection.yourDetails.appealingOnBehalfOf
									.split(' ')
									.slice(1)
									?.join(' '),
						emailAddress: appeal.aboutYouSection.yourDetails.isOriginalApplicant
							? appeal.email
							: undefined
					},
					agent: !appeal.aboutYouSection.yourDetails.isOriginalApplicant
						? {
								firstName: appeal.aboutYouSection.yourDetails.name.split(' ')[0],
								lastName: appeal.aboutYouSection.yourDetails.name.split(' ').splice(1)?.join(' '),
								emailAddress: appeal.email
						  }
						: undefined,
					siteAddressLine1: appeal.appealSiteSection.siteAddress.addressLine1,
					siteAddressLine2: appeal.appealSiteSection.siteAddress.addressLine2,
					siteAddressTown: appeal.appealSiteSection.siteAddress.town,
					siteAddressCounty: appeal.appealSiteSection.siteAddress.county,
					siteAddressPostcode: appeal.appealSiteSection.siteAddress.postcode,
					isSiteFullyOwned: appeal.appealSiteSection.siteOwnership.ownsWholeSite,
					hasToldOwners: appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold,
					isSiteVisible: appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad,
					inspectorAccessDetails: appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted,
					doesSiteHaveHealthAndSafetyIssues: appeal.appealSiteSection.healthAndSafety.hasIssues,
					healthAndSafetyIssuesDetails:
						appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssuesDetails,
					// todo we need to fix the formatting on these and there is technical debt in order to collect the correct metadata, commenting out for now as BO are not yet ready for this
					documents: []
				}
			}
		];
	}
}

module.exports = { HasAppealMapper };
