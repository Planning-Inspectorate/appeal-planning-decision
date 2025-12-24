/**
 * @typedef {Object} FieldNames
 * @property {DynamicFormFieldName} changedListedBuildingNumber
 * @property {DynamicFormFieldName} affectedListedBuildingNumber
 * @property {DynamicFormFieldName} appellantLinkedCaseReference
 * @property {DynamicFormFieldName} nearbyAppealReference
 * @property {DynamicFormFieldName} namedIndividual
 * @property {DynamicFormFieldName} contactAddress
 * @property {DynamicFormFieldName} neighbourSiteAddress

 */

/**
 * @typedef {'changedListedBuildingNumber'
 *   | 'affectedListedBuildingNumber'
 *   | 'appellantLinkedCaseReference'
 *   | 'nearbyAppealReference'
 * 	 | 'namedIndividual'
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
	namedIndividual: 'namedIndividual',
	contactAddress: 'contactAddress',
	neighbourSiteAddress: 'neighbourSiteAddress'
});
