/**
 *
 * @param {Object<string, CASE_TYPE>} appealType
 * @returns {string}
 */
const mapAppealTypeToDisplayText = (appealType) => {
	return appealType?.type?.toLowerCase().replace('cas', 'CAS');
};

module.exports = { mapAppealTypeToDisplayText };
