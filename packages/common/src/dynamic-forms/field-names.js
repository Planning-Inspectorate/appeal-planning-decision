/**
 * @typedef {Object} FieldNames
 * @property {DynamicFormFieldName} changedListedBuildingNumber
 * @property {DynamicFormFieldName} affectedListedBuildingNumber
 * @property {DynamicFormFieldName} appellantLinkedCaseReference
 * @property {DynamicFormFieldName} nearbyAppealReference
 * @property {DynamicFormFieldName} enforcementNamedIndividual
 * @property {DynamicFormFieldName} contactAddress
 * @property {DynamicFormFieldName} neighbourSiteAddress

 */

/**
 * @typedef {'changedListedBuildingNumber'
 *   | 'affectedListedBuildingNumber'
 *   | 'appellantLinkedCaseReference'
 *   | 'nearbyAppealReference'
 * 	 | 'enforcementNamedIndividual'
 * 	 | 'contactAddress'
 *   | 'neighbourSiteAddress'
 * } DynamicFormFieldName
 */

/**
 * @type {FieldNames}
 */
exports.fieldNames = Object.freeze({
	changedListedBuildingNumber: 'changedListedBuildingNumber',
	affectedListedBuildingNumber: 'affectedListedBuildingNumber',
	appellantLinkedCaseReference: 'appellantLinkedCaseReference',
	nearbyAppealReference: 'nearbyAppealReference',
	enforcementNamedIndividual: 'enforcementNamedIndividual',
	contactAddress: 'contactAddress',
	neighbourSiteAddress: 'neighbourSiteAddress'
});
