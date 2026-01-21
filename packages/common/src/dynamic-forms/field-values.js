/**
 * @typedef {string} DynamicFormFieldValue
 */

/**
 * @enum {DynamicFormFieldValue}
 */
exports.fieldValues = Object.freeze({
	majorMinorDevelopment: {
		MAJOR: 'major',
		MINOR: 'minor',
		OTHER: 'other'
	},
	applicationAbout: {
		HOUSEHOLDER: 'householder',
		CHANGE_OF_USE: 'change-of-use',
		MINERAL_WORKINGS: 'mineral-workings',
		DWELLINGS: 'dwellings',
		INDUSTRY_STORAGE: 'industry-storage',
		OFFICES: 'offices',
		RETAIL_SERVICES: 'retail-services',
		TRAVELLER_CARAVAN: 'traveller-caravan',
		OTHER: 'other'
	},
	designatedSites: {
		other: 'other'
	},
	enforcementWhoIsAppealing: {
		INDIVIDUAL: 'individual',
		GROUP: 'group',
		ORGANISATION: 'organisation'
	},
	lawfulDevelopmentCertificateType: {
		EXISTING_DEVELOPMENT: 'existing-development',
		PROPOSED_USE_DEVELOPMENT: 'proposed-use-of-a-development',
		PROPOSED_CHANGES_LISTED_BUILDING: 'proposed-changes-to-a-listed-building'
	}
});
