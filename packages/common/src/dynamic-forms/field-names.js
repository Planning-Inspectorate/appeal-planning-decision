/**
 * @typedef {Object} FieldNames
 * @property {DynamicFormFieldName} changedListedBuildingNumber
 * @property {DynamicFormFieldName} affectedListedBuildingNumber
 * @property {DynamicFormFieldName} appellantLinkedCaseReference
 * @property {DynamicFormFieldName} nearbyAppealReference
 * @property {DynamicFormFieldName} enforcementNamedIndividual
 */

/**
 * @typedef {'changedListedBuildingNumber'
 *   | 'affectedListedBuildingNumber'
 *   | 'appellantLinkedCaseReference'
 *   | 'nearbyAppealReference'
 * 	 | 'enforcementNamedIndividual'
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
	enforcementNamedIndividual: 'enforcementNamedIndividual'
});
