/**
 * @typedef {Object} FieldNames
 * @property {DynamicFormFieldName} changedListedBuildingNumber
 * @property {DynamicFormFieldName} affectedListedBuildingNumber
 * @property {DynamicFormFieldName} appellantLinkedCaseReference
 * @property {DynamicFormFieldName} nearbyAppealReference
 */

/**
 * @typedef {'changedListedBuildingNumber'
 *   | 'affectedListedBuildingNumber'
 *   | 'appellantLinkedCaseReference'
 *   | 'nearbyAppealReference'
 * } DynamicFormFieldName
 */

/**
 * @type {FieldNames}
 */
exports.fieldNames = Object.freeze({
	changedListedBuildingNumber: 'changedListedBuildingNumber',
	affectedListedBuildingNumber: 'affectedListedBuildingNumber',
	appellantLinkedCaseReference: 'appellantLinkedCaseReference',
	nearbyAppealReference: 'nearbyAppealReference'
});
